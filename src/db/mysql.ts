import { createPool, type Pool } from "mysql2/promise";

import type { AppConfig } from "../interfaces/app-config";

let pool: Pool | null = null;

export function createMySqlPool(config: AppConfig): Pool {
  return createPool({
    host: config.dbHost,
    port: config.dbPort,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    connectionLimit: 10,
  });
}

export async function ensureSchema(dbPool: Pool): Promise<void> {
  await dbPool.execute(
    `
      CREATE TABLE IF NOT EXISTS greetings (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        message VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `,
  );

  await dbPool.execute(
    `
      CREATE TABLE IF NOT EXISTS profiles (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(50) NOT NULL,
        date_of_birth DATE NOT NULL,
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        version INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `,
  );

  await dbPool.execute(
    `
      CREATE TABLE IF NOT EXISTS profile_addresses (
        profile_id BIGINT PRIMARY KEY,
        line1 VARCHAR(255) NOT NULL,
        line2 VARCHAR(255) NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_profile_addresses_profile_id
          FOREIGN KEY (profile_id) REFERENCES profiles(id)
          ON DELETE CASCADE
      )
    `,
  );

  await dbPool.execute(
    `
      CREATE TABLE IF NOT EXISTS profile_preferences (
        profile_id BIGINT PRIMARY KEY,
        allow_marketing TINYINT(1) NOT NULL DEFAULT 0,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_profile_preferences_profile_id
          FOREIGN KEY (profile_id) REFERENCES profiles(id)
          ON DELETE CASCADE
      )
    `,
  );

  await dbPool.execute(
    `
      CREATE TABLE IF NOT EXISTS profile_audit_logs (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        profile_id BIGINT NOT NULL,
        action VARCHAR(50) NOT NULL,
        changed_fields JSON NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_profile_audit_logs_profile_id_created_at (profile_id, created_at),
        CONSTRAINT fk_profile_audit_logs_profile_id
          FOREIGN KEY (profile_id) REFERENCES profiles(id)
          ON DELETE CASCADE
      )
    `,
  );
}

export async function getMySqlPool(config: AppConfig): Promise<Pool> {
  if (pool !== null) {
    return pool;
  }

  const createdPool = createMySqlPool(config);
  await ensureSchema(createdPool);
  pool = createdPool;

  return createdPool;
}
