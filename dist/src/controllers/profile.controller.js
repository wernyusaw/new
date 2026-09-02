"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const tsyringe_1 = require("tsyringe");
const response_status_1 = require("../constants/response-status");
const injection_tokens_1 = require("../di/injection-tokens");
const profile_request_mapper_1 = require("../mappers/request/profile-request.mapper");
const api_response_mapper_1 = require("../mappers/response/api-response.mapper");
const profile_response_mapper_1 = require("../mappers/response/profile-response.mapper");
let ProfileController = class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }
    async createProfile(request, response) {
        const input = (0, profile_request_mapper_1.mapCreateProfileRequest)(request);
        if (input === null) {
            response.status(response_status_1.ResponseStatusCode.BAD_REQUEST).json((0, api_response_mapper_1.mapErrorResponse)(response_status_1.ResponseStatusCode.BAD_REQUEST, "Invalid profile payload"));
            return;
        }
        try {
            const createdProfile = await this.profileService.createProfile(input);
            response.status(response_status_1.ResponseStatusCode.OK).json((0, api_response_mapper_1.mapSuccessResponse)(response_status_1.ResponseStatusCode.OK, (0, profile_response_mapper_1.mapProfileResponse)(createdProfile)));
        }
        catch (error) {
            console.error("Failed to create profile", error);
            response.status(response_status_1.ResponseStatusCode.INTERNAL_SERVER_ERROR).json((0, api_response_mapper_1.mapErrorResponse)(response_status_1.ResponseStatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error"));
        }
    }
    async getProfileById(request, response) {
        const profileId = (0, profile_request_mapper_1.mapProfileByIdQueryRequest)(request);
        if (profileId === null) {
            response.status(response_status_1.ResponseStatusCode.BAD_REQUEST).json((0, api_response_mapper_1.mapErrorResponse)(response_status_1.ResponseStatusCode.BAD_REQUEST, "Invalid profile id"));
            return;
        }
        try {
            const profile = await this.profileService.getProfileById(profileId);
            if (profile === null) {
                response.status(response_status_1.ResponseStatusCode.NOT_FOUND).json((0, api_response_mapper_1.mapErrorResponse)(response_status_1.ResponseStatusCode.NOT_FOUND, "Profile not found"));
                return;
            }
            response.status(response_status_1.ResponseStatusCode.OK).json((0, api_response_mapper_1.mapSuccessResponse)(response_status_1.ResponseStatusCode.OK, (0, profile_response_mapper_1.mapProfileResponse)(profile)));
        }
        catch (error) {
            console.error("Failed to get profile", error);
            response.status(response_status_1.ResponseStatusCode.INTERNAL_SERVER_ERROR).json((0, api_response_mapper_1.mapErrorResponse)(response_status_1.ResponseStatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error"));
        }
    }
    async updateProfile(request, response) {
        const profileId = (0, profile_request_mapper_1.mapUpdateProfileIdRequest)(request);
        if (profileId === null) {
            response.status(response_status_1.ResponseStatusCode.BAD_REQUEST).json((0, api_response_mapper_1.mapErrorResponse)(response_status_1.ResponseStatusCode.BAD_REQUEST, "Invalid profile id"));
            return;
        }
        const input = (0, profile_request_mapper_1.mapUpdateProfileRequest)(request);
        if (input === null) {
            response.status(response_status_1.ResponseStatusCode.BAD_REQUEST).json((0, api_response_mapper_1.mapErrorResponse)(response_status_1.ResponseStatusCode.BAD_REQUEST, "Invalid profile update payload"));
            return;
        }
        try {
            const updateResult = await this.profileService.updateProfile(profileId, input);
            if (updateResult.status === "not-found") {
                response.status(response_status_1.ResponseStatusCode.NOT_FOUND).json((0, api_response_mapper_1.mapErrorResponse)(response_status_1.ResponseStatusCode.NOT_FOUND, "Profile not found"));
                return;
            }
            if (updateResult.status === "inactive") {
                response.status(response_status_1.ResponseStatusCode.CONFLICT).json((0, api_response_mapper_1.mapErrorResponse)(response_status_1.ResponseStatusCode.CONFLICT, "Inactive profile cannot be updated"));
                return;
            }
            response.status(response_status_1.ResponseStatusCode.OK).json((0, api_response_mapper_1.mapSuccessResponse)(response_status_1.ResponseStatusCode.OK, (0, profile_response_mapper_1.mapProfileResponse)(updateResult.profile)));
        }
        catch (error) {
            console.error("Failed to update profile", error);
            response.status(response_status_1.ResponseStatusCode.INTERNAL_SERVER_ERROR).json((0, api_response_mapper_1.mapErrorResponse)(response_status_1.ResponseStatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error"));
        }
    }
};
exports.ProfileController = ProfileController;
exports.ProfileController = ProfileController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(injection_tokens_1.ServiceTokens.ProfileService)),
    __metadata("design:paramtypes", [Object])
], ProfileController);
