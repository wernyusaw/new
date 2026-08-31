import { describe, expect, it } from "@jest/globals";
import request from "supertest";

import "../../src/di/dependency-registry";
import { createApp } from "../../Bootstrap";

describe("GET /api/greeting", () => {
  it("returns greeting response", async () => {
    const app = createApp();

    const response = await request(app)
      .get("/api/greeting")
      .query({ name: "Tom" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      resultCode: 200,
      resultMessage: "success",
    });
    expect(response.body.resultData).toHaveProperty("message");
  });

  it("returns 404 when greeting by name is not found", async () => {
    const app = createApp();

    const response = await request(app).get("/api/greeting/UnknownName");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      resultCode: 404,
      resultMessage: "Greeting not found",
    });
  });

  it("returns 400 when greeting by name is blank", async () => {
    const app = createApp();

    const response = await request(app).get("/api/greeting/%20%20");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      resultCode: 400,
      resultMessage: "Name is required",
    });
  });
});
