export const ResponseStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type ResponseStatusCodeValue = typeof ResponseStatusCode[keyof typeof ResponseStatusCode];

export const ResponseStatusText: Record<ResponseStatusCodeValue, string> = {
  [ResponseStatusCode.OK]: "The request completed successfully.",
  [ResponseStatusCode.BAD_REQUEST]: "The request payload or parameters are invalid.",
  [ResponseStatusCode.NOT_FOUND]: "The requested resource was not found.",
  [ResponseStatusCode.CONFLICT]: "The request conflicts with the current resource state.",
  [ResponseStatusCode.INTERNAL_SERVER_ERROR]: "The server failed while processing the request.",
};
