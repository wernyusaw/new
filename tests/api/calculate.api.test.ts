import { describe, expect, it } from "@jest/globals";
import request from "supertest";

import "../../src/di/dependency-registry";
import { createApp } from "../../Bootstrap";

describe("POST /api/calculate", () => {
  it("returns calculated value", async () => {
    const app = createApp();

    const response = await request(app)
      .post("/api/calculate")
      .send({
        currentValue: 100,
        changeBy: 15,
        operation: "decrease",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      resultCode: 200,
      resultMessage: "success",
      resultData: {
        operation: "decrease",
        originalValue: 100,
        changeBy: 15,
        changedValue: 85,
      },
    });
  });

  it("returns calculated value for increase operation", async () => {
    const app = createApp();

    const response = await request(app)
      .post("/api/calculate")
      .send({
        currentValue: 100,
        changeBy: 15,
        operation: "increase",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      resultCode: 200,
      resultMessage: "success",
      resultData: {
        operation: "increase",
        originalValue: 100,
        changeBy: 15,
        changedValue: 115,
      },
    });
  });

  it("returns 400 for invalid payload", async () => {
    const app = createApp();

    const response = await request(app)
      .post("/api/calculate")
      .send({
        currentValue: "100",
        operation: "increase",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      resultCode: 400,
      resultMessage: "currentValue, changeBy and operation are required",
    });
  });
});
