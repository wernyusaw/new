"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const tsyringe_1 = require("tsyringe");
Object.defineProperty(exports, "container", { enumerable: true, get: function () { return tsyringe_1.container; } });
const dotenv_1 = __importDefault(require("dotenv"));
const injection_tokens_1 = require("./injection-tokens");
const mysql_greeting_repository_1 = require("../repositories/mysql-greeting.repository");
const noop_greeting_repository_1 = require("../repositories/noop-greeting.repository");
const greeting_service_1 = require("../services/greeting.service");
const hello_service_1 = require("../services/hello.service");
dotenv_1.default.config();
const appConfig = {
    defaultName: "Saw",
    greetingStyle: process.env.GREETING_STYLE === "formal" ? "formal" : "casual",
    dbHost: process.env.DB_HOST ?? "localhost",
    dbPort: Number(process.env.DB_PORT ?? "3306"),
    dbUser: process.env.DB_USER ?? "root",
    dbPassword: process.env.DB_PASSWORD ?? "root",
    dbName: process.env.DB_NAME ?? "app_db",
};
tsyringe_1.container.register(injection_tokens_1.ServiceTokens.AppConfig, {
    useValue: appConfig,
});
tsyringe_1.container.register(injection_tokens_1.ServiceTokens.HelloService, {
    useClass: hello_service_1.HelloService,
});
const shouldEnableDb = process.env.DB_ENABLED === "true";
const greetingRepository = shouldEnableDb
    ? tsyringe_1.container.resolve(mysql_greeting_repository_1.MySqlGreetingRepository)
    : tsyringe_1.container.resolve(noop_greeting_repository_1.NoopGreetingRepository);
tsyringe_1.container.register(injection_tokens_1.ServiceTokens.GreetingRepository, {
    useValue: greetingRepository,
});
tsyringe_1.container.register(injection_tokens_1.ServiceTokens.GreetingService, {
    useClass: greeting_service_1.GreetingService,
});
