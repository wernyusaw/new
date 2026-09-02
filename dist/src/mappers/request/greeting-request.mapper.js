"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGetGreetingRequest = mapGetGreetingRequest;
exports.mapGetGreetingByNameRequest = mapGetGreetingByNameRequest;
const zod_1 = require("zod");
const optionalNameSchema = zod_1.z.string().trim().min(1).max(100);
const requiredNameSchema = zod_1.z.string().trim().min(1).max(100);
function mapGetGreetingRequest(input, appConfig) {
    const result = optionalNameSchema.safeParse(input.query.name);
    return {
        name: result.success ? result.data : appConfig.defaultName,
    };
}
function mapGetGreetingByNameRequest(input) {
    const result = requiredNameSchema.safeParse(input.params.name);
    return {
        name: result.success ? result.data : "",
    };
}
