import { describe, expect, it } from "@jest/globals";

import type { ProfileResponseDto } from "../../src/dtos/response/profile/profile-response.dto";
import { mapProfileResponse } from "../../src/mappers/response/profile-response.mapper";

describe("profile response mapper", () => {
  it("returns the profile dto unchanged", () => {
    const profile: ProfileResponseDto = {
      id: 1,
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      phone: "0800000000",
      dateOfBirth: "1990-01-20",
      status: "active",
      version: 1,
      address: {
        line1: "123 Main St",
        city: "Bangkok",
        state: "Bangkok",
        postalCode: "10100",
        country: "Thailand",
      },
      preferences: {
        allowMarketing: true,
      },
    };

    expect(mapProfileResponse(profile)).toBe(profile);
    expect(mapProfileResponse(profile)).toEqual(profile);
  });
});
