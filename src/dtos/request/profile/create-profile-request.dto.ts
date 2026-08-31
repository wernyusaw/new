export type ProfileStatus = "active" | "inactive";

export interface CreateProfileAddressDto {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateProfilePreferencesDto {
  allowMarketing: boolean;
}

export interface CreateProfileRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  status: ProfileStatus;
  address: CreateProfileAddressDto;
  preferences: CreateProfilePreferencesDto;
}
