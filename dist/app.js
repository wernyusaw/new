"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./src/di/dependency-registry");
const Bootstrap_1 = require("./Bootstrap");
(0, Bootstrap_1.bootstrap)().catch((error) => {
    console.error("Failed to start application", error);
    process.exit(1);
});
