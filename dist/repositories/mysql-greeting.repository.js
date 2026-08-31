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
exports.MySqlGreetingRepository = void 0;
const tsyringe_1 = require("tsyringe");
const injection_tokens_1 = require("../di/injection-tokens");
const mysql_1 = require("../db/mysql");
let MySqlGreetingRepository = class MySqlGreetingRepository {
    constructor(appConfig) {
        this.appConfig = appConfig;
    }
    async saveGreeting(name, message) {
        const pool = await (0, mysql_1.getMySqlPool)(this.appConfig);
        // Use parameterized query to prevent SQL injection from user input.
        await pool.execute("INSERT INTO greetings (name, message) VALUES (?, ?)", [name, message]);
    }
    async getGreetingByName(name) {
        const pool = await (0, mysql_1.getMySqlPool)(this.appConfig);
        const [rows] = await pool.execute("SELECT message FROM greetings WHERE name = ?", [name]);
        const result = rows;
        return result.length > 0 ? result[0].message : null;
    }
};
exports.MySqlGreetingRepository = MySqlGreetingRepository;
exports.MySqlGreetingRepository = MySqlGreetingRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(injection_tokens_1.ServiceTokens.AppConfig)),
    __metadata("design:paramtypes", [Object])
], MySqlGreetingRepository);
