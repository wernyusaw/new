"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapMessageResponse = mapMessageResponse;
exports.mapErrorResponse = mapErrorResponse;
exports.mapCalculateValueChangeResponse = mapCalculateValueChangeResponse;
function mapMessageResponse(message) {
    return { message };
}
function mapErrorResponse(message) {
    return { message };
}
function mapCalculateValueChangeResponse(input) {
    return input;
}
