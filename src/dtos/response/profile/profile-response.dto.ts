import type { ProfileStatus } from "../../request/profile/create-profile-request.dto";

export interface ProfileAddressResponseDto {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ProfilePreferencesResponseDto {
  allowMarketing: boolean;
}

export interface ProfileResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  status: ProfileStatus;
  version: number;
  address: ProfileAddressResponseDto;
  preferences: ProfilePreferencesResponseDto;
}
