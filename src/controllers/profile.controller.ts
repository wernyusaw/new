import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ResponseStatusCode } from "../constants/response-status";
import { ServiceTokens } from "../di/injection-tokens";
import type { ProfileServicePort } from "../interfaces/profile-service.port";
import {
  mapCreateProfileRequest,
  mapProfileByIdQueryRequest,
  mapUpdateProfileIdRequest,
  mapUpdateProfileRequest,
} from "../mappers/request/profile-request.mapper";
import { mapErrorResponse, mapSuccessResponse } from "../mappers/response/api-response.mapper";
import { mapProfileResponse } from "../mappers/response/profile-response.mapper";

@injectable()
export class ProfileController {
  public constructor(
    @inject(ServiceTokens.ProfileService)
    private readonly profileService: ProfileServicePort,
  ) {}

  public async createProfile(request: Request, response: Response): Promise<void> {
    const input = mapCreateProfileRequest(request);

    if (input === null) {
      response.status(ResponseStatusCode.BAD_REQUEST).json(mapErrorResponse(ResponseStatusCode.BAD_REQUEST, "Invalid profile payload"));
      return;
    }

    try {
      const createdProfile = await this.profileService.createProfile(input);
      response.status(ResponseStatusCode.OK).json(mapSuccessResponse(ResponseStatusCode.OK, mapProfileResponse(createdProfile)));
    } catch (error: unknown) {
      console.error("Failed to create profile", error);
      response.status(ResponseStatusCode.INTERNAL_SERVER_ERROR).json(mapErrorResponse(ResponseStatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error"));
    }
  }

  public async getProfileById(request: Request, response: Response): Promise<void> {
    const profileId = mapProfileByIdQueryRequest(request);

    if (profileId === null) {
      response.status(ResponseStatusCode.BAD_REQUEST).json(mapErrorResponse(ResponseStatusCode.BAD_REQUEST, "Invalid profile id"));
      return;
    }

    try {
      const profile = await this.profileService.getProfileById(profileId);

      if (profile === null) {
        response.status(ResponseStatusCode.NOT_FOUND).json(mapErrorResponse(ResponseStatusCode.NOT_FOUND, "Profile not found"));
        return;
      }

      response.status(ResponseStatusCode.OK).json(mapSuccessResponse(ResponseStatusCode.OK, mapProfileResponse(profile)));
    } catch (error: unknown) {
      console.error("Failed to get profile", error);
      response.status(ResponseStatusCode.INTERNAL_SERVER_ERROR).json(mapErrorResponse(ResponseStatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error"));
    }
  }

  public async updateProfile(request: Request, response: Response): Promise<void> {
    const profileId = mapUpdateProfileIdRequest(request);

    if (profileId === null) {
      response.status(ResponseStatusCode.BAD_REQUEST).json(mapErrorResponse(ResponseStatusCode.BAD_REQUEST, "Invalid profile id"));
      return;
    }

    const input = mapUpdateProfileRequest(request);

    if (input === null) {
      response.status(ResponseStatusCode.BAD_REQUEST).json(mapErrorResponse(ResponseStatusCode.BAD_REQUEST, "Invalid profile update payload"));
      return;
    }

    try {
      const updateResult = await this.profileService.updateProfile(profileId, input);

      if (updateResult.status === "not-found") {
        response.status(ResponseStatusCode.NOT_FOUND).json(mapErrorResponse(ResponseStatusCode.NOT_FOUND, "Profile not found"));
        return;
      }

      if (updateResult.status === "inactive") {
        response.status(ResponseStatusCode.CONFLICT).json(mapErrorResponse(ResponseStatusCode.CONFLICT, "Inactive profile cannot be updated"));
        return;
      }

      response.status(ResponseStatusCode.OK).json(mapSuccessResponse(ResponseStatusCode.OK, mapProfileResponse(updateResult.profile)));
    } catch (error: unknown) {
      console.error("Failed to update profile", error);
      response.status(ResponseStatusCode.INTERNAL_SERVER_ERROR).json(mapErrorResponse(ResponseStatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error"));
    }
  }
}
