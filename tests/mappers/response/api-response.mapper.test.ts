import { describe, expect, it } from "@jest/globals";

import { mapErrorResponse, mapSuccessResponse } from "../../../src/mappers/response/api-response.mapper";

describe("api response mapper", () => {
  it("maps success response", () => {
    expect(mapSuccessResponse(200, { message: "hello" })).toEqual({
      resultCode: 200,
      resultMessage: "success",
      resultData: {
        message: "hello",
      },
    });
  });

  it("maps error response", () => {
    expect(mapErrorResponse(500, "Internal Server Error")).toEqual({
      resultCode: 500,
      resultMessage: "Internal Server Error",
    });
  });
});
