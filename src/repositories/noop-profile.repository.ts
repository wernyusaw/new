import { injectable } from "tsyringe";

import type { CreateProfileRequestDto } from "../dtos/request/profile/create-profile-request.dto";
import type { UpdateProfileRequestDto } from "../dtos/request/profile/update-profile-request.dto";
import type { ProfileResponseDto } from "../dtos/response/profile/profile-response.dto";
import type { ProfileRepositoryPort, UpdateProfileResult } from "../interfaces/profile-repository.port";

@injectable()
export class NoopProfileRepository implements ProfileRepositoryPort {
  private nextId = 1;
  private readonly profiles = new Map<number, ProfileResponseDto>();

  public async createProfile(input: CreateProfileRequestDto): Promise<ProfileResponseDto> {
    const createdProfile: ProfileResponseDto = {
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

  public async getProfileById(id: number): Promise<ProfileResponseDto | null> {
    return this.profiles.get(id) ?? null;
  }

  public async updateProfile(id: number, input: UpdateProfileRequestDto): Promise<UpdateProfileResult> {
    const existingProfile = this.profiles.get(id);

    if (!existingProfile) {
      return { status: "not-found" };
    }

    if (existingProfile.status !== "active") {
      return { status: "inactive" };
    }

    const updatedProfile: ProfileResponseDto = {
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
}
