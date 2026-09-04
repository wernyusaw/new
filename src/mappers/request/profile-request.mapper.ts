import type { CreateProfileRequestDto } from "../../dtos/request/profile/create-profile-request.dto";
import type { UpdateProfileRequestDto } from "../../dtos/request/profile/update-profile-request.dto";
import type {
  CreateProfileRequestBodyInput,
  ProfileByIdRequestQueryInput,
  UpdateProfileRequestBodyInput,
} from "../../models/request/profile-request.model";
import { createProfileSchema } from "../../schemas/request/profile/create-profile.schema";
import { profileIdSchema } from "../../schemas/request/profile/profile-id.schema";
import { updateProfileSchema } from "../../schemas/request/profile/update-profile.schema";

function parsePositiveInteger(value: unknown): number | null {
  const result = profileIdSchema.safeParse(value);

  return result.success ? result.data : null;
}

export function mapCreateProfileRequest(input: CreateProfileRequestBodyInput): CreateProfileRequestDto | null {
  const result = createProfileSchema.safeParse(input.body);

  return result.success ? result.data : null;
}

export function mapProfileByIdQueryRequest(input: ProfileByIdRequestQueryInput): number | null {
  return parsePositiveInteger(input.query.id);
}

export function mapUpdateProfileIdRequest(input: UpdateProfileRequestBodyInput): number | null {
  return parsePositiveInteger(input.body.id);
}

export function mapUpdateProfileRequest(input: UpdateProfileRequestBodyInput): UpdateProfileRequestDto | null {
  const result = updateProfileSchema.safeParse(input.body);

  return result.success ? result.data : null;
}
