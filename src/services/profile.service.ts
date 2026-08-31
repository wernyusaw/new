import { inject, injectable } from "tsyringe";

import { ServiceTokens } from "../di/injection-tokens";
import type { CreateProfileRequestDto } from "../dtos/request/profile/create-profile-request.dto";
import type { UpdateProfileRequestDto } from "../dtos/request/profile/update-profile-request.dto";
import type { ProfileResponseDto } from "../dtos/response/profile/profile-response.dto";
import type { ProfileRepositoryPort, UpdateProfileResult } from "../interfaces/profile-repository.port";
import type { ProfileServicePort } from "../interfaces/profile-service.port";

@injectable()
export class ProfileService implements ProfileServicePort {
  public constructor(
    @inject(ServiceTokens.ProfileRepository)
    private readonly profileRepository: ProfileRepositoryPort,
  ) {}

  public async createProfile(input: CreateProfileRequestDto): Promise<ProfileResponseDto> {
    return this.profileRepository.createProfile(input);
  }

  public async getProfileById(id: number): Promise<ProfileResponseDto | null> {
    return this.profileRepository.getProfileById(id);
  }

  public async updateProfile(id: number, input: UpdateProfileRequestDto): Promise<UpdateProfileResult> {
    return this.profileRepository.updateProfile(id, input);
  }
}
