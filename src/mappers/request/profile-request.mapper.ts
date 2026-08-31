import type { CreateProfileRequestDto, ProfileStatus } from "../../dtos/request/profile/create-profile-request.dto";
import type { UpdateProfileRequestDto } from "../../dtos/request/profile/update-profile-request.dto";
import type {
  CreateProfileRequestBodyInput,
  ProfileByIdRequestQueryInput,
  UpdateProfileRequestBodyInput,
} from "../../models/request/profile-request.model";

function isProfileStatus(value: unknown): value is ProfileStatus {
  return value === "active" || value === "inactive";
}

function isNotEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parsePositiveInteger(value: unknown): number | null {
  const numericId = Number(value);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return null;
  }

  return numericId;
}

export function mapCreateProfileRequest(input: CreateProfileRequestBodyInput): CreateProfileRequestDto | null {
  const body = input.body;

  if (
    !isNotEmptyString(body.firstName)
    || !isNotEmptyString(body.lastName)
    || !isNotEmptyString(body.email)
    || !isNotEmptyString(body.phone)
    || !isNotEmptyString(body.dateOfBirth)
    || !isProfileStatus(body.status)
    || body.address === undefined
    || !isNotEmptyString(body.address.line1)
    || (body.address.line2 !== undefined && typeof body.address.line2 !== "string")
    || !isNotEmptyString(body.address.city)
    || !isNotEmptyString(body.address.state)
    || !isNotEmptyString(body.address.postalCode)
    || !isNotEmptyString(body.address.country)
    || body.preferences === undefined
    || typeof body.preferences.allowMarketing !== "boolean"
  ) {
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

export function mapProfileByIdQueryRequest(input: ProfileByIdRequestQueryInput): number | null {
  return parsePositiveInteger(input.query.id);
}

export function mapUpdateProfileIdRequest(input: UpdateProfileRequestBodyInput): number | null {
  return parsePositiveInteger(input.body.id);
}

export function mapUpdateProfileRequest(input: UpdateProfileRequestBodyInput): UpdateProfileRequestDto | null {
  const body = input.body;
  const output: UpdateProfileRequestDto = {};

  if (body.firstName !== undefined) {
    if (!isNotEmptyString(body.firstName)) {
      return null;
    }
    output.firstName = body.firstName.trim();
  }

  if (body.lastName !== undefined) {
    if (!isNotEmptyString(body.lastName)) {
      return null;
    }
    output.lastName = body.lastName.trim();
  }

  if (body.email !== undefined) {
    if (!isNotEmptyString(body.email)) {
      return null;
    }
    output.email = body.email.trim();
  }

  if (body.phone !== undefined) {
    if (!isNotEmptyString(body.phone)) {
      return null;
    }
    output.phone = body.phone.trim();
  }

  if (body.dateOfBirth !== undefined) {
    if (!isNotEmptyString(body.dateOfBirth)) {
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
      if (!isNotEmptyString(body.address.line1)) {
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
      if (!isNotEmptyString(body.address.city)) {
        return null;
      }
      output.address.city = body.address.city.trim();
    }

    if (body.address.state !== undefined) {
      if (!isNotEmptyString(body.address.state)) {
        return null;
      }
      output.address.state = body.address.state.trim();
    }

    if (body.address.postalCode !== undefined) {
      if (!isNotEmptyString(body.address.postalCode)) {
        return null;
      }
      output.address.postalCode = body.address.postalCode.trim();
    }

    if (body.address.country !== undefined) {
      if (!isNotEmptyString(body.address.country)) {
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

  const hasAnyChanges =
    output.firstName !== undefined
    || output.lastName !== undefined
    || output.email !== undefined
    || output.phone !== undefined
    || output.dateOfBirth !== undefined
    || output.status !== undefined
    || output.address !== undefined
    || output.preferences !== undefined;

  return hasAnyChanges ? output : null;
}
