"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCreateProfileRequest = mapCreateProfileRequest;
exports.mapProfileByIdRequest = mapProfileByIdRequest;
exports.mapUpdateProfileRequest = mapUpdateProfileRequest;
function isProfileStatus(value) {
    return value === "active" || value === "inactive";
}
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function mapCreateProfileRequest(input) {
    const body = input.body;
    if (!isNonEmptyString(body.firstName)
        || !isNonEmptyString(body.lastName)
        || !isNonEmptyString(body.email)
        || !isNonEmptyString(body.phone)
        || !isNonEmptyString(body.dateOfBirth)
        || !isProfileStatus(body.status)
        || body.address === undefined
        || !isNonEmptyString(body.address.line1)
        || (body.address.line2 !== undefined && typeof body.address.line2 !== "string")
        || !isNonEmptyString(body.address.city)
        || !isNonEmptyString(body.address.state)
        || !isNonEmptyString(body.address.postalCode)
        || !isNonEmptyString(body.address.country)
        || body.preferences === undefined
        || typeof body.preferences.allowMarketing !== "boolean") {
        return null;
    }
    return {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        dateOfBirth: body.dateOfBirth.trim(),
        status: body.status,
        address: {
            line1: body.address.line1.trim(),
            line2: body.address.line2?.trim(),
            city: body.address.city.trim(),
            state: body.address.state.trim(),
            postalCode: body.address.postalCode.trim(),
            country: body.address.country.trim(),
        },
        preferences: {
            allowMarketing: body.preferences.allowMarketing,
        },
    };
}
function mapProfileByIdRequest(input) {
    const numericId = Number(input.params.id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
        return null;
    }
    return numericId;
}
function mapUpdateProfileRequest(input) {
    const body = input.body;
    const output = {};
    if (body.firstName !== undefined) {
        if (!isNonEmptyString(body.firstName)) {
            return null;
        }
        output.firstName = body.firstName.trim();
    }
    if (body.lastName !== undefined) {
        if (!isNonEmptyString(body.lastName)) {
            return null;
        }
        output.lastName = body.lastName.trim();
    }
    if (body.email !== undefined) {
        if (!isNonEmptyString(body.email)) {
            return null;
        }
        output.email = body.email.trim();
    }
    if (body.phone !== undefined) {
        if (!isNonEmptyString(body.phone)) {
            return null;
        }
        output.phone = body.phone.trim();
    }
    if (body.dateOfBirth !== undefined) {
        if (!isNonEmptyString(body.dateOfBirth)) {
            return null;
        }
        output.dateOfBirth = body.dateOfBirth.trim();
    }
    if (body.status !== undefined) {
        if (!isProfileStatus(body.status)) {
            return null;
        }
        output.status = body.status;
    }
    if (body.address !== undefined) {
        output.address = {};
        if (body.address.line1 !== undefined) {
            if (!isNonEmptyString(body.address.line1)) {
                return null;
            }
            output.address.line1 = body.address.line1.trim();
        }
        if (body.address.line2 !== undefined) {
            if (typeof body.address.line2 !== "string") {
                return null;
            }
            output.address.line2 = body.address.line2.trim();
        }
        if (body.address.city !== undefined) {
            if (!isNonEmptyString(body.address.city)) {
                return null;
            }
            output.address.city = body.address.city.trim();
        }
        if (body.address.state !== undefined) {
            if (!isNonEmptyString(body.address.state)) {
                return null;
            }
            output.address.state = body.address.state.trim();
        }
        if (body.address.postalCode !== undefined) {
            if (!isNonEmptyString(body.address.postalCode)) {
                return null;
            }
            output.address.postalCode = body.address.postalCode.trim();
        }
        if (body.address.country !== undefined) {
            if (!isNonEmptyString(body.address.country)) {
                return null;
            }
            output.address.country = body.address.country.trim();
        }
    }
    if (body.preferences !== undefined) {
        output.preferences = {};
        if (body.preferences.allowMarketing !== undefined) {
            if (typeof body.preferences.allowMarketing !== "boolean") {
                return null;
            }
            output.preferences.allowMarketing = body.preferences.allowMarketing;
        }
    }
    const hasAnyChanges = output.firstName !== undefined
        || output.lastName !== undefined
        || output.email !== undefined
        || output.phone !== undefined
        || output.dateOfBirth !== undefined
        || output.status !== undefined
        || output.address !== undefined
        || output.preferences !== undefined;
    return hasAnyChanges ? output : null;
}
