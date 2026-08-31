"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMySqlPool = createMySqlPool;
exports.ensureSchema = ensureSchema;
exports.getMySqlPool = getMySqlPool;
const promise_1 = require("mysql2/promise");
let pool = null;
function createMySqlPool(config) {
    return (0, promise_1.createPool)({
        host: config.dbHost,
        port: config.dbPort,
        user: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
        connectionLimit: 10,
    });
}
async function ensureSchema(dbPool) {
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS greetings (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        message VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
}
async function getMySqlPool(config) {
    if (pool !== null) {
        return pool;
    }
    const createdPool = createMySqlPool(config);
    await ensureSchema(createdPool);
    pool = createdPool;
    return createdPool;
}
