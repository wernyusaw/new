"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlProfileRepository = void 0;
const tsyringe_1 = require("tsyringe");
const injection_tokens_1 = require("../di/injection-tokens");
const mysql_1 = require("../db/mysql");
let MySqlProfileRepository = class MySqlProfileRepository {
    constructor(appConfig) {
        this.appConfig = appConfig;
    }
    async createProfile(input) {
        const pool = await (0, mysql_1.getMySqlPool)(this.appConfig);
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [profileResult] = await connection.execute(`
          INSERT INTO profiles (first_name, last_name, email, phone, date_of_birth, status, version)
          VALUES (?, ?, ?, ?, ?, ?, 1)
        `, [input.firstName, input.lastName, input.email, input.phone, input.dateOfBirth, input.status]);
            const profileId = Number(profileResult.insertId);
            await connection.execute(`
          INSERT INTO profile_addresses (profile_id, line1, line2, city, state, postal_code, country)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
                profileId,
                input.address.line1,
                input.address.line2 ?? null,
                input.address.city,
                input.address.state,
                input.address.postalCode,
                input.address.country,
            ]);
            await connection.execute(`
          INSERT INTO profile_preferences (profile_id, allow_marketing)
          VALUES (?, ?)
        `, [profileId, input.preferences.allowMarketing ? 1 : 0]);
            await connection.execute(`
          INSERT INTO profile_audit_logs (profile_id, action, changed_fields)
          VALUES (?, 'create', ?)
        `, [profileId, JSON.stringify(["firstName", "lastName", "email", "phone", "dateOfBirth", "status", "address", "preferences"])]);
            await connection.commit();
            const createdProfile = await this.getProfileById(profileId);
            if (createdProfile === null) {
                throw new Error("Failed to load created profile");
            }
            return createdProfile;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    async getProfileById(id) {
        const pool = await (0, mysql_1.getMySqlPool)(this.appConfig);
        const [rows] = await pool.execute(`
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
      `, [id]);
        const mappedRows = rows;
        if (mappedRows.length === 0) {
            return null;
        }
        return this.mapJoinedRowToDto(mappedRows[0]);
    }
    async updateProfile(id, input) {
        const pool = await (0, mysql_1.getMySqlPool)(this.appConfig);
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [statusRows] = await connection.execute("SELECT status FROM profiles WHERE id = ? FOR UPDATE", [id]);
            const foundRows = statusRows;
            if (foundRows.length === 0) {
                await connection.rollback();
                return { status: "not-found" };
            }
            if (foundRows[0].status !== "active") {
                await connection.rollback();
                return { status: "inactive" };
            }
            await connection.execute(`
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
        `, [
                input.firstName ?? null,
                input.lastName ?? null,
                input.email ?? null,
                input.phone ?? null,
                input.dateOfBirth ?? null,
                input.status ?? null,
                id,
            ]);
            const hasAddressUpdate = input.address !== undefined;
            if (hasAddressUpdate) {
                await connection.execute(`
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
          `, [
                    id,
                    input.address?.line1 ?? null,
                    input.address?.line2 ?? null,
                    input.address?.city ?? null,
                    input.address?.state ?? null,
                    input.address?.postalCode ?? null,
                    input.address?.country ?? null,
                ]);
            }
            if (input.preferences?.allowMarketing !== undefined) {
                await connection.execute(`
            INSERT INTO profile_preferences (profile_id, allow_marketing)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
              allow_marketing = VALUES(allow_marketing),
              updated_at = CURRENT_TIMESTAMP
          `, [id, input.preferences.allowMarketing ? 1 : 0]);
            }
            const changedFields = this.collectChangedFields(input);
            if (changedFields.length > 0) {
                await connection.execute(`
            INSERT INTO profile_audit_logs (profile_id, action, changed_fields)
            VALUES (?, 'update', ?)
          `, [id, JSON.stringify(changedFields)]);
            }
            await connection.commit();
            const updatedProfile = await this.getProfileById(id);
            if (updatedProfile === null) {
                return { status: "not-found" };
            }
            return { status: "updated", profile: updatedProfile };
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    mapJoinedRowToDto(row) {
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
    collectChangedFields(input) {
        const changedFields = [];
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
};
exports.MySqlProfileRepository = MySqlProfileRepository;
exports.MySqlProfileRepository = MySqlProfileRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(injection_tokens_1.ServiceTokens.AppConfig)),
    __metadata("design:paramtypes", [Object])
], MySqlProfileRepository);
