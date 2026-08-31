import { inject, injectable } from "tsyringe";
import type { PoolConnection } from "mysql2/promise";

import { ServiceTokens } from "../di/injection-tokens";
import { getMySqlPool } from "../db/mysql";
import type { AppConfig } from "../interfaces/app-config";
import type { CreateProfileRequestDto } from "../dtos/request/profile/create-profile-request.dto";
import type { UpdateProfileRequestDto } from "../dtos/request/profile/update-profile-request.dto";
import type { ProfileResponseDto } from "../dtos/response/profile/profile-response.dto";
import type { ProfileRepositoryPort, UpdateProfileResult } from "../interfaces/profile-repository.port";

type ProfileJoinedRow = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  status: "active" | "inactive";
  version: number;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  allow_marketing: 0 | 1;
};

@injectable()
export class MySqlProfileRepository implements ProfileRepositoryPort {
  public constructor(@inject(ServiceTokens.AppConfig) private readonly appConfig: AppConfig) {}

  public async createProfile(input: CreateProfileRequestDto): Promise<ProfileResponseDto> {
    const pool = await getMySqlPool(this.appConfig);
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [profileResult] = await connection.execute(
        `
          INSERT INTO profiles (first_name, last_name, email, phone, date_of_birth, status, version)
          VALUES (?, ?, ?, ?, ?, ?, 1)
        `,
        [input.firstName, input.lastName, input.email, input.phone, input.dateOfBirth, input.status],
      );

      const profileId = Number((profileResult as { insertId: number }).insertId);

      await connection.execute(
        `
          INSERT INTO profile_addresses (profile_id, line1, line2, city, state, postal_code, country)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          profileId,
          input.address.line1,
          input.address.line2 ?? null,
          input.address.city,
          input.address.state,
          input.address.postalCode,
          input.address.country,
        ],
      );

      await connection.execute(
        `
          INSERT INTO profile_preferences (profile_id, allow_marketing)
          VALUES (?, ?)
        `,
        [profileId, input.preferences.allowMarketing ? 1 : 0],
      );

      await connection.execute(
        `
          INSERT INTO profile_audit_logs (profile_id, action, changed_fields)
          VALUES (?, 'create', ?)
        `,
        [profileId, JSON.stringify(["firstName", "lastName", "email", "phone", "dateOfBirth", "status", "address", "preferences"])],
      );

      await connection.commit();

      const createdProfile = await this.getProfileById(profileId);

      if (createdProfile === null) {
        throw new Error("Failed to load created profile");
      }

      return createdProfile;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  public async getProfileById(id: number): Promise<ProfileResponseDto | null> {
    const pool = await getMySqlPool(this.appConfig);

    const [rows] = await pool.execute(
      `
        SELECT
          p.id,
          p.first_name,
          p.last_name,
          p.email,
          p.phone,
          DATE_FORMAT(p.date_of_birth, '%Y-%m-%d') AS date_of_birth,
          p.status,
          p.version,
          a.line1,
          a.line2,
          a.city,
          a.state,
          a.postal_code,
          a.country,
          pr.allow_marketing
        FROM profiles p
        INNER JOIN profile_addresses a ON a.profile_id = p.id
        INNER JOIN profile_preferences pr ON pr.profile_id = p.id
        WHERE p.id = ?
      `,
      [id],
    );

    const mappedRows = rows as ProfileJoinedRow[];

    if (mappedRows.length === 0) {
      return null;
    }

    return this.mapJoinedRowToDto(mappedRows[0]);
  }

  public async updateProfile(id: number, input: UpdateProfileRequestDto): Promise<UpdateProfileResult> {
    const pool = await getMySqlPool(this.appConfig);
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [statusRows] = await connection.execute(
        "SELECT status FROM profiles WHERE id = ? FOR UPDATE",
        [id],
      );

      const foundRows = statusRows as { status: "active" | "inactive" }[];

      if (foundRows.length === 0) {
        await connection.rollback();
        return { status: "not-found" };
      }

      if (foundRows[0].status !== "active") {
        await connection.rollback();
        return { status: "inactive" };
      }

      await connection.execute(
        `
          UPDATE profiles
          SET
            first_name = COALESCE(?, first_name),
            last_name = COALESCE(?, last_name),
            email = COALESCE(?, email),
            phone = COALESCE(?, phone),
            date_of_birth = COALESCE(?, date_of_birth),
            status = COALESCE(?, status),
            version = version + 1,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        [
          input.firstName ?? null,
          input.lastName ?? null,
          input.email ?? null,
          input.phone ?? null,
          input.dateOfBirth ?? null,
          input.status ?? null,
          id,
        ],
      );

      const hasAddressUpdate = input.address !== undefined;

      if (hasAddressUpdate) {
        await connection.execute(
          `
            INSERT INTO profile_addresses (profile_id, line1, line2, city, state, postal_code, country)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              line1 = COALESCE(VALUES(line1), line1),
              line2 = COALESCE(VALUES(line2), line2),
              city = COALESCE(VALUES(city), city),
              state = COALESCE(VALUES(state), state),
              postal_code = COALESCE(VALUES(postal_code), postal_code),
              country = COALESCE(VALUES(country), country),
              updated_at = CURRENT_TIMESTAMP
          `,
          [
            id,
            input.address?.line1 ?? null,
            input.address?.line2 ?? null,
            input.address?.city ?? null,
            input.address?.state ?? null,
            input.address?.postalCode ?? null,
            input.address?.country ?? null,
          ],
        );
      }

      if (input.preferences?.allowMarketing !== undefined) {
        await connection.execute(
          `
            INSERT INTO profile_preferences (profile_id, allow_marketing)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
              allow_marketing = VALUES(allow_marketing),
              updated_at = CURRENT_TIMESTAMP
          `,
          [id, input.preferences.allowMarketing ? 1 : 0],
        );
      }

      const changedFields = this.collectChangedFields(input);

      if (changedFields.length > 0) {
        await connection.execute(
          `
            INSERT INTO profile_audit_logs (profile_id, action, changed_fields)
            VALUES (?, 'update', ?)
          `,
          [id, JSON.stringify(changedFields)],
        );
      }

      await connection.commit();

      const updatedProfile = await this.getProfileById(id);

      if (updatedProfile === null) {
        return { status: "not-found" };
      }

      return { status: "updated", profile: updatedProfile };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  private mapJoinedRowToDto(row: ProfileJoinedRow): ProfileResponseDto {
    return {
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      dateOfBirth: row.date_of_birth,
      status: row.status,
      version: row.version,
      address: {
        line1: row.line1,
        line2: row.line2 ?? undefined,
        city: row.city,
        state: row.state,
        postalCode: row.postal_code,
        country: row.country,
      },
      preferences: {
        allowMarketing: row.allow_marketing === 1,
      },
    };
  }

  private collectChangedFields(input: UpdateProfileRequestDto): string[] {
    const changedFields: string[] = [];

    if (input.firstName !== undefined) {
      changedFields.push("firstName");
    }
    if (input.lastName !== undefined) {
      changedFields.push("lastName");
    }
    if (input.email !== undefined) {
      changedFields.push("email");
    }
    if (input.phone !== undefined) {
      changedFields.push("phone");
    }
    if (input.dateOfBirth !== undefined) {
      changedFields.push("dateOfBirth");
    }
    if (input.status !== undefined) {
      changedFields.push("status");
    }
    if (input.address !== undefined) {
      changedFields.push("address");
    }
    if (input.preferences !== undefined) {
      changedFields.push("preferences");
    }

    return changedFields;
  }
}
