"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseStatusText = exports.ResponseStatusCode = void 0;
exports.ResponseStatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};
exports.ResponseStatusText = {
    [exports.ResponseStatusCode.OK]: "The request completed successfully.",
    [exports.ResponseStatusCode.BAD_REQUEST]: "The request payload or parameters are invalid.",
    [exports.ResponseStatusCode.NOT_FOUND]: "The requested resource was not found.",
    [exports.ResponseStatusCode.CONFLICT]: "The request conflicts with the current resource state.",
    [exports.ResponseStatusCode.INTERNAL_SERVER_ERROR]: "The server failed while processing the request.",
};
