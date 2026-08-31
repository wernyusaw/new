"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const api_response_mapper_1 = require("../../../src/mappers/response/api-response.mapper");
(0, globals_1.describe)("api response mapper", () => {
    (0, globals_1.it)("maps message response", () => {
        (0, globals_1.expect)((0, api_response_mapper_1.mapMessageResponse)("hello")).toEqual({ message: "hello" });
    });
    (0, globals_1.it)("maps error response", () => {
        (0, globals_1.expect)((0, api_response_mapper_1.mapErrorResponse)("Internal Server Error")).toEqual({ message: "Internal Server Error" });
    });
});
