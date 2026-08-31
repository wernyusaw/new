export type CreateProfileRequestBodyInput = {
  body: {
    firstName?: unknown;
    lastName?: unknown;
    email?: unknown;
    phone?: unknown;
    dateOfBirth?: unknown;
    status?: unknown;
    address?: {
      line1?: unknown;
      line2?: unknown;
      city?: unknown;
      state?: unknown;
      postalCode?: unknown;
      country?: unknown;
    };
    preferences?: {
      allowMarketing?: unknown;
    };
  };
};

export type UpdateProfileRequestBodyInput = {
  body: {
    id?: unknown;
    firstName?: unknown;
    lastName?: unknown;
    email?: unknown;
    phone?: unknown;
    dateOfBirth?: unknown;
    status?: unknown;
    address?: {
      line1?: unknown;
      line2?: unknown;
      city?: unknown;
      state?: unknown;
      postalCode?: unknown;
      country?: unknown;
    };
    preferences?: {
      allowMarketing?: unknown;
    };
  };
};

export type ProfileByIdRequestQueryInput = {
  query: {
    id?: unknown;
  };
};
