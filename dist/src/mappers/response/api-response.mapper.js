"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSuccessResponse = mapSuccessResponse;
exports.mapErrorResponse = mapErrorResponse;
function mapSuccessResponse(resultCode, resultData, resultMessage = "success") {
    return {
        resultCode,
        resultMessage,
        resultData,
    };
}
function mapErrorResponse(resultCode, resultMessage) {
    return {
        resultCode,
        resultMessage,
    };
}
