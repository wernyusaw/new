"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopProfileRepository = void 0;
const tsyringe_1 = require("tsyringe");
let NoopProfileRepository = class NoopProfileRepository {
    constructor() {
        this.nextId = 1;
        this.profiles = new Map();
    }
    async createProfile(input) {
        const createdProfile = {
            id: this.nextId,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
            dateOfBirth: input.dateOfBirth,
            status: input.status,
            version: 1,
            address: {
                line1: input.address.line1,
                line2: input.address.line2,
                city: input.address.city,
                state: input.address.state,
                postalCode: input.address.postalCode,
                country: input.address.country,
            },
            preferences: {
                allowMarketing: input.preferences.allowMarketing,
            },
        };
        this.profiles.set(this.nextId, createdProfile);
        this.nextId += 1;
        return createdProfile;
    }
    async getProfileById(id) {
        return this.profiles.get(id) ?? null;
    }
    async updateProfile(id, input) {
        const existingProfile = this.profiles.get(id);
        if (!existingProfile) {
            return { status: "not-found" };
        }
        if (existingProfile.status !== "active") {
            return { status: "inactive" };
        }
        const updatedProfile = {
            ...existingProfile,
            firstName: input.firstName ?? existingProfile.firstName,
            lastName: input.lastName ?? existingProfile.lastName,
            email: input.email ?? existingProfile.email,
            phone: input.phone ?? existingProfile.phone,
            dateOfBirth: input.dateOfBirth ?? existingProfile.dateOfBirth,
            status: input.status ?? existingProfile.status,
            version: existingProfile.version + 1,
            address: {
                line1: input.address?.line1 ?? existingProfile.address.line1,
                line2: input.address?.line2 ?? existingProfile.address.line2,
                city: input.address?.city ?? existingProfile.address.city,
                state: input.address?.state ?? existingProfile.address.state,
                postalCode: input.address?.postalCode ?? existingProfile.address.postalCode,
                country: input.address?.country ?? existingProfile.address.country,
            },
            preferences: {
                allowMarketing: input.preferences?.allowMarketing ?? existingProfile.preferences.allowMarketing,
            },
        };
        this.profiles.set(id, updatedProfile);
        return { status: "updated", profile: updatedProfile };
    }
};
exports.NoopProfileRepository = NoopProfileRepository;
exports.NoopProfileRepository = NoopProfileRepository = __decorate([
    (0, tsyringe_1.injectable)()
], NoopProfileRepository);
