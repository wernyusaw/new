"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGetHelloRequest = mapGetHelloRequest;
function mapGetHelloRequest(input, appConfig) {
    const rawName = input.query.name;
    if (typeof rawName !== "string") {
        return { name: appConfig.defaultName };
    }
    const normalizedName = rawName.trim();
    return {
        name: normalizedName.length > 0 ? normalizedName : appConfig.defaultName,
    };
}
