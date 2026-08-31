import type { CreateProfileRequestDto } from "../dtos/request/profile/create-profile-request.dto";
import type { UpdateProfileRequestDto } from "../dtos/request/profile/update-profile-request.dto";
import type { ProfileResponseDto } from "../dtos/response/profile/profile-response.dto";

export type UpdateProfileResult =
  | { status: "updated"; profile: ProfileResponseDto }
  | { status: "not-found" }
  | { status: "inactive" };

export interface ProfileRepositoryPort {
  createProfile(input: CreateProfileRequestDto): Promise<ProfileResponseDto>;
  getProfileById(id: number): Promise<ProfileResponseDto | null>;
  updateProfile(id: number, input: UpdateProfileRequestDto): Promise<UpdateProfileResult>;
}
