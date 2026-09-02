"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const api_response_mapper_1 = require("../../src/mappers/response/api-response.mapper");
(0, globals_1.describe)("api response mapper", () => {
    (0, globals_1.it)("maps success response", () => {
        (0, globals_1.expect)((0, api_response_mapper_1.mapSuccessResponse)(200, { message: "hello" })).toEqual({
            resultCode: 200,
            resultMessage: "success",
            resultData: {
                message: "hello",
            },
        });
    });
    (0, globals_1.it)("maps error response", () => {
        (0, globals_1.expect)((0, api_response_mapper_1.mapErrorResponse)(500, "Internal Server Error")).toEqual({
            resultCode: 500,
            resultMessage: "Internal Server Error",
        });
    });
});
