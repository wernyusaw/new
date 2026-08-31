"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGetGreetingRequest = mapGetGreetingRequest;
exports.mapGetGreetingByNameRequest = mapGetGreetingByNameRequest;
function mapGetGreetingRequest(request, appConfig) {
    const rawName = request.query.name;
    if (typeof rawName !== "string") {
        return { name: appConfig.defaultName };
    }
    const normalizedName = rawName.trim();
    return {
        name: normalizedName.length > 0 ? normalizedName : appConfig.defaultName,
    };
}
function mapGetGreetingByNameRequest(request) {
    return {
        name: request.params.name.trim(),
    };
}
