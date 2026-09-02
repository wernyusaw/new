"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const profile_request_mapper_1 = require("../../src/mappers/request/profile-request.mapper");
function buildValidCreateBody() {
    return {
        body: {
            firstName: " Alice ",
            lastName: " Johnson ",
            email: " alice@example.com ",
            phone: " 0800000000 ",
            dateOfBirth: " 1990-01-20 ",
            status: "active",
            address: {
                line1: " 123 Main St ",
                line2: " Suite 1 ",
                city: " Bangkok ",
                state: " Bangkok ",
                postalCode: " 10100 ",
                country: " Thailand ",
            },
            preferences: {
                allowMarketing: true,
            },
        },
    };
}
(0, globals_1.describe)("mapCreateProfileRequest", () => {
    (0, globals_1.it)("maps and trims a fully valid body", () => {
        const result = (0, profile_request_mapper_1.mapCreateProfileRequest)(buildValidCreateBody());
        (0, globals_1.expect)(result).toEqual({
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice@example.com",
            phone: "0800000000",
            dateOfBirth: "1990-01-20",
            status: "active",
            address: {
                line1: "123 Main St",
                line2: "Suite 1",
                city: "Bangkok",
                state: "Bangkok",
                postalCode: "10100",
                country: "Thailand",
            },
            preferences: {
                allowMarketing: true,
            },
        });
    });
    (0, globals_1.it)("omits line2 when not provided", () => {
        const input = buildValidCreateBody();
        delete input.body.address.line2;
        const result = (0, profile_request_mapper_1.mapCreateProfileRequest)(input);
        (0, globals_1.expect)(result?.address.line2).toBeUndefined();
    });
    globals_1.it.each([
        "firstName",
        "lastName",
        "email",
        "phone",
        "dateOfBirth",
    ])("returns null when %s is missing", (field) => {
        const input = buildValidCreateBody();
        delete input.body[field];
        (0, globals_1.expect)((0, profile_request_mapper_1.mapCreateProfileRequest)(input)).toBeNull();
    });
    (0, globals_1.it)("returns null when status is invalid", () => {
        const input = buildValidCreateBody();
        input.body.status = "unknown";
        (0, globals_1.expect)((0, profile_request_mapper_1.mapCreateProfileRequest)(input)).toBeNull();
    });
    (0, globals_1.it)("returns null when email format is invalid", () => {
        const input = buildValidCreateBody();
        input.body.email = "not-an-email";
        (0, globals_1.expect)((0, profile_request_mapper_1.mapCreateProfileRequest)(input)).toBeNull();
    });
    (0, globals_1.it)("returns null when dateOfBirth is not a real ISO date", () => {
        const input = buildValidCreateBody();
        input.body.dateOfBirth = "2024-02-31";
        (0, globals_1.expect)((0, profile_request_mapper_1.mapCreateProfileRequest)(input)).toBeNull();
    });
    (0, globals_1.it)("returns null when address is missing", () => {
        const input = buildValidCreateBody();
        delete input.body.address;
        (0, globals_1.expect)((0, profile_request_mapper_1.mapCreateProfileRequest)(input)).toBeNull();
    });
    (0, globals_1.it)("returns null when address.line2 is not a string", () => {
        const input = buildValidCreateBody();
        input.body.address.line2 = 123;
        (0, globals_1.expect)((0, profile_request_mapper_1.mapCreateProfileRequest)(input)).toBeNull();
    });
    (0, globals_1.it)("returns null when preferences is missing", () => {
        const input = buildValidCreateBody();
        delete input.body.preferences;
        (0, globals_1.expect)((0, profile_request_mapper_1.mapCreateProfileRequest)(input)).toBeNull();
    });
    (0, globals_1.it)("returns null when preferences.allowMarketing is not a boolean", () => {
        const input = buildValidCreateBody();
        input.body.preferences.allowMarketing = "yes";
        (0, globals_1.expect)((0, profile_request_mapper_1.mapCreateProfileRequest)(input)).toBeNull();
    });
});
(0, globals_1.describe)("mapProfileByIdQueryRequest", () => {
    (0, globals_1.it)("returns the numeric id for a valid positive integer string", () => {
        (0, globals_1.expect)((0, profile_request_mapper_1.mapProfileByIdQueryRequest)({ query: { id: "42" } })).toBe(42);
    });
    (0, globals_1.it)("returns null when id is missing", () => {
        (0, globals_1.expect)((0, profile_request_mapper_1.mapProfileByIdQueryRequest)({ query: {} })).toBeNull();
    });
    (0, globals_1.it)("returns null when id is zero or negative", () => {
        (0, globals_1.expect)((0, profile_request_mapper_1.mapProfileByIdQueryRequest)({ query: { id: "0" } })).toBeNull();
        (0, globals_1.expect)((0, profile_request_mapper_1.mapProfileByIdQueryRequest)({ query: { id: "-1" } })).toBeNull();
    });
    (0, globals_1.it)("returns null when id is not an integer", () => {
        (0, globals_1.expect)((0, profile_request_mapper_1.mapProfileByIdQueryRequest)({ query: { id: "1.5" } })).toBeNull();
    });
});
(0, globals_1.describe)("mapUpdateProfileIdRequest", () => {
    (0, globals_1.it)("returns the numeric id from body.id", () => {
        (0, globals_1.expect)((0, profile_request_mapper_1.mapUpdateProfileIdRequest)({ body: { id: "10" } })).toBe(10);
    });
    (0, globals_1.it)("returns null for an invalid body.id", () => {
        (0, globals_1.expect)((0, profile_request_mapper_1.mapUpdateProfileIdRequest)({ body: { id: "abc" } })).toBeNull();
    });
});
(0, globals_1.describe)("mapUpdateProfileRequest", () => {
    (0, globals_1.it)("returns null when no fields are provided", () => {
        (0, globals_1.expect)((0, profile_request_mapper_1.mapUpdateProfileRequest)({ body: { id: "1" } })).toBeNull();
    });
    (0, globals_1.it)("maps and trims a single provided field", () => {
        const result = (0, profile_request_mapper_1.mapUpdateProfileRequest)({ body: { id: "1", firstName: "  Robert  " } });
        (0, globals_1.expect)(result).toEqual({ firstName: "Robert" });
    });
    (0, globals_1.it)("returns null when firstName is an empty string", () => {
        (0, globals_1.expect)((0, profile_request_mapper_1.mapUpdateProfileRequest)({ body: { id: "1", firstName: "   " } })).toBeNull();
    });
    (0, globals_1.it)("returns null when status is invalid", () => {
        (0, globals_1.expect)((0, profile_request_mapper_1.mapUpdateProfileRequest)({ body: { id: "1", status: "archived" } })).toBeNull();
    });
    (0, globals_1.it)("returns null when an updated email has an invalid format", () => {
        (0, globals_1.expect)((0, profile_request_mapper_1.mapUpdateProfileRequest)({ body: { id: "1", email: "invalid" } })).toBeNull();
    });
    (0, globals_1.it)("returns null when an updated dateOfBirth is not a real ISO date", () => {
        (0, globals_1.expect)((0, profile_request_mapper_1.mapUpdateProfileRequest)({ body: { id: "1", dateOfBirth: "2023-02-29" } })).toBeNull();
    });
    (0, globals_1.it)("maps a partial address update", () => {
        const result = (0, profile_request_mapper_1.mapUpdateProfileRequest)({ body: { id: "1", address: { city: " Phuket " } } });
        (0, globals_1.expect)(result).toEqual({ address: { city: "Phuket" } });
    });
    (0, globals_1.it)("returns null when address.line2 is not a string", () => {
        (0, globals_1.expect)((0, profile_request_mapper_1.mapUpdateProfileRequest)({ body: { id: "1", address: { line2: 123 } } })).toBeNull();
    });
    (0, globals_1.it)("maps a partial preferences update", () => {
        const result = (0, profile_request_mapper_1.mapUpdateProfileRequest)({ body: { id: "1", preferences: { allowMarketing: false } } });
        (0, globals_1.expect)(result).toEqual({ preferences: { allowMarketing: false } });
    });
    (0, globals_1.it)("returns null when preferences.allowMarketing is not a boolean", () => {
        (0, globals_1.expect)((0, profile_request_mapper_1.mapUpdateProfileRequest)({ body: { id: "1", preferences: { allowMarketing: "no" } } })).toBeNull();
    });
});
