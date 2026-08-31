import type { CreateProfileRequestDto } from "../dtos/request/profile/create-profile-request.dto";
import type { UpdateProfileRequestDto } from "../dtos/request/profile/update-profile-request.dto";
import type { ProfileResponseDto } from "../dtos/response/profile/profile-response.dto";
import type { UpdateProfileResult } from "./profile-repository.port";

export interface ProfileServicePort {
  createProfile(input: CreateProfileRequestDto): Promise<ProfileResponseDto>;
  getProfileById(id: number): Promise<ProfileResponseDto | null>;
  updateProfile(id: number, input: UpdateProfileRequestDto): Promise<UpdateProfileResult>;
}
