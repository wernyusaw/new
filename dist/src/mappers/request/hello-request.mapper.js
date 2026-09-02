"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGetHelloRequest = mapGetHelloRequest;
const zod_1 = require("zod");
const optionalNameSchema = zod_1.z.string().trim().min(1).max(100);
function mapGetHelloRequest(input, appConfig) {
    const result = optionalNameSchema.safeParse(input.query.name);
    return {
        name: result.success ? result.data : appConfig.defaultName,
    };
}
