import { describe, expect, it } from "@jest/globals";

import type { CreateProfileRequestBodyInput } from "../../src/models/request/profile-request.model";
import {
  mapCreateProfileRequest,
  mapProfileByIdQueryRequest,
  mapUpdateProfileIdRequest,
  mapUpdateProfileRequest,
} from "../../src/mappers/request/profile-request.mapper";

function buildValidCreateBody(): CreateProfileRequestBodyInput {
  return {
    body: {
      firstName: " Alice ",
      lastName: " Johnson ",
      email: " alice@example.com ",
      phone: " 0800000000 ",
      dateOfBirth: " 1990-01-20 ",
      status: "active",
      address: {
        line1: " 123 Main St ",
        line2: " Suite 1 ",
        city: " Bangkok ",
        state: " Bangkok ",
        postalCode: " 10100 ",
        country: " Thailand ",
      },
      preferences: {
        allowMarketing: true,
      },
    },
  };
}

describe("mapCreateProfileRequest", () => {
  it("maps and trims a fully valid body", () => {
    const result = mapCreateProfileRequest(buildValidCreateBody());

    expect(result).toEqual({
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      phone: "0800000000",
      dateOfBirth: "1990-01-20",
      status: "active",
      address: {
        line1: "123 Main St",
        line2: "Suite 1",
        city: "Bangkok",
        state: "Bangkok",
        postalCode: "10100",
        country: "Thailand",
      },
      preferences: {
        allowMarketing: true,
      },
    });
  });

  it("omits line2 when not provided", () => {
    const input = buildValidCreateBody();
    delete input.body.address!.line2;

    const result = mapCreateProfileRequest(input);

    expect(result?.address.line2).toBeUndefined();
  });

  it.each([
    "firstName",
    "lastName",
    "email",
    "phone",
    "dateOfBirth",
  ] as const)("returns null when %s is missing", (field) => {
    const input = buildValidCreateBody();
    delete input.body[field];

    expect(mapCreateProfileRequest(input)).toBeNull();
  });

  it("returns null when status is invalid", () => {
    const input = buildValidCreateBody();
    input.body.status = "unknown";

    expect(mapCreateProfileRequest(input)).toBeNull();
  });

  it("returns null when email format is invalid", () => {
    const input = buildValidCreateBody();
    input.body.email = "not-an-email";

    expect(mapCreateProfileRequest(input)).toBeNull();
  });

  it("returns null when dateOfBirth is not a real ISO date", () => {
    const input = buildValidCreateBody();
    input.body.dateOfBirth = "2024-02-31";

    expect(mapCreateProfileRequest(input)).toBeNull();
  });

  it("returns null when address is missing", () => {
    const input = buildValidCreateBody();
    delete (input.body as { address?: unknown }).address;

    expect(mapCreateProfileRequest(input)).toBeNull();
  });

  it("returns null when address.line2 is not a string", () => {
    const input = buildValidCreateBody();
    input.body.address!.line2 = 123;

    expect(mapCreateProfileRequest(input)).toBeNull();
  });

  it("returns null when preferences is missing", () => {
    const input = buildValidCreateBody();
    delete (input.body as { preferences?: unknown }).preferences;

    expect(mapCreateProfileRequest(input)).toBeNull();
  });

  it("returns null when preferences.allowMarketing is not a boolean", () => {
    const input = buildValidCreateBody();
    input.body.preferences!.allowMarketing = "yes";

    expect(mapCreateProfileRequest(input)).toBeNull();
  });
});

describe("mapProfileByIdQueryRequest", () => {
  it("returns the numeric id for a valid positive integer string", () => {
    expect(mapProfileByIdQueryRequest({ query: { id: "42" } })).toBe(42);
  });

  it("returns null when id is missing", () => {
    expect(mapProfileByIdQueryRequest({ query: {} })).toBeNull();
  });

  it("returns null when id is zero or negative", () => {
    expect(mapProfileByIdQueryRequest({ query: { id: "0" } })).toBeNull();
    expect(mapProfileByIdQueryRequest({ query: { id: "-1" } })).toBeNull();
  });

  it("returns null when id is not an integer", () => {
    expect(mapProfileByIdQueryRequest({ query: { id: "1.5" } })).toBeNull();
  });
});

describe("mapUpdateProfileIdRequest", () => {
  it("returns the numeric id from body.id", () => {
    expect(mapUpdateProfileIdRequest({ body: { id: "10" } })).toBe(10);
  });

  it("returns null for an invalid body.id", () => {
    expect(mapUpdateProfileIdRequest({ body: { id: "abc" } })).toBeNull();
  });
});

describe("mapUpdateProfileRequest", () => {
  it("returns null when no fields are provided", () => {
    expect(mapUpdateProfileRequest({ body: { id: "1" } })).toBeNull();
  });

  it("maps and trims a single provided field", () => {
    const result = mapUpdateProfileRequest({ body: { id: "1", firstName: "  Robert  " } });

    expect(result).toEqual({ firstName: "Robert" });
  });

  it("returns null when firstName is an empty string", () => {
    expect(mapUpdateProfileRequest({ body: { id: "1", firstName: "   " } })).toBeNull();
  });

  it("returns null when status is invalid", () => {
    expect(mapUpdateProfileRequest({ body: { id: "1", status: "archived" } })).toBeNull();
  });

  it("returns null when an updated email has an invalid format", () => {
    expect(mapUpdateProfileRequest({ body: { id: "1", email: "invalid" } })).toBeNull();
  });

  it("returns null when an updated dateOfBirth is not a real ISO date", () => {
    expect(mapUpdateProfileRequest({ body: { id: "1", dateOfBirth: "2023-02-29" } })).toBeNull();
  });

  it("maps a partial address update", () => {
    const result = mapUpdateProfileRequest({ body: { id: "1", address: { city: " Phuket " } } });

    expect(result).toEqual({ address: { city: "Phuket" } });
  });

  it("returns null when address.line2 is not a string", () => {
    expect(mapUpdateProfileRequest({ body: { id: "1", address: { line2: 123 } } })).toBeNull();
  });

  it("maps a partial preferences update", () => {
    const result = mapUpdateProfileRequest({ body: { id: "1", preferences: { allowMarketing: false } } });

    expect(result).toEqual({ preferences: { allowMarketing: false } });
  });

  it("returns null when preferences.allowMarketing is not a boolean", () => {
    expect(mapUpdateProfileRequest({ body: { id: "1", preferences: { allowMarketing: "no" } } })).toBeNull();
  });
});
