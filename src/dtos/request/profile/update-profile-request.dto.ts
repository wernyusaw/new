import type { ProfileStatus } from "./create-profile-request.dto";

export interface UpdateProfileAddressDto {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface UpdateProfilePreferencesDto {
  allowMarketing?: boolean;
}

export interface UpdateProfileRequestDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  status?: ProfileStatus;
  address?: UpdateProfileAddressDto;
  preferences?: UpdateProfilePreferencesDto;
}
