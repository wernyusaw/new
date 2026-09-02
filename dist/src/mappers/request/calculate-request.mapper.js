"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCalculateValueChangeRequest = mapCalculateValueChangeRequest;
const zod_1 = require("zod");
const calculateValueChangeSchema = zod_1.z.object({
    currentValue: zod_1.z.number(),
    changeBy: zod_1.z.number(),
    operation: zod_1.z.enum(["increase", "decrease"]),
});
function mapCalculateValueChangeRequest(input) {
    const result = calculateValueChangeSchema.safeParse(input.body);
    return result.success ? result.data : null;
}
