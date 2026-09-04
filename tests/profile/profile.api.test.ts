import { describe, expect, it } from "@jest/globals";
import request from "supertest";

import "../../src/di/dependency-registry";
import { createApp } from "../../Bootstrap";

describe("Profile Master API", () => {
  it("creates and fetches a profile", async () => {
    const app = createApp();

    const createResponse = await request(app)
      .post("/api/profiles/create")
      .send({
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice@example.com",
        phone: "0800000000",
        dateOfBirth: "20/01/1990",
        status: "active",
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
      });

    expect(createResponse.status).toBe(200);
    expect(createResponse.body.resultCode).toBe(200);
    expect(createResponse.body.resultMessage).toBe("success");
    expect(createResponse.body.resultData).toHaveProperty("id");
    expect(createResponse.body.resultData).toMatchObject({
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      status: "active",
      version: 1,
    });

    const profileId = createResponse.body.resultData.id as number;

    const getResponse = await request(app)
      .get("/api/profiles/get")
      .query({ id: profileId });

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.resultCode).toBe(200);
    expect(getResponse.body.resultMessage).toBe("success");
    expect(getResponse.body.resultData).toMatchObject({
      id: profileId,
      firstName: "Alice",
      preferences: {
        allowMarketing: true,
      },
    });

  });

  it("updates an active profile with POST", async () => {
    const app = createApp();

    const createResponse = await request(app)
      .post("/api/profiles/create")
      .send({
        firstName: "Bob",
        lastName: "Lee",
        email: "bob@example.com",
        phone: "0811111111",
        dateOfBirth: "10/02/1988",
        status: "active",
        address: {
          line1: "55 New Rd",
          city: "Chiang Mai",
          state: "Chiang Mai",
          postalCode: "50000",
          country: "Thailand",
        },
        preferences: {
          allowMarketing: false,
        },
      });

    const profileId = createResponse.body.resultData.id as number;

    const updateResponse = await request(app)
      .post("/api/profiles/update")
      .send({
        id: profileId,
        firstName: "Robert",
        preferences: {
          allowMarketing: true,
        },
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.resultCode).toBe(200);
    expect(updateResponse.body.resultMessage).toBe("success");
    expect(updateResponse.body.resultData).toMatchObject({
      id: profileId,
      firstName: "Robert",
      preferences: {
        allowMarketing: true,
      },
    });
    expect(updateResponse.body.resultData.version).toBeGreaterThan(1);
  });

  it("rejects update for inactive profile", async () => {
    const app = createApp();

    const createResponse = await request(app)
      .post("/api/profiles/create")
      .send({
        firstName: "Carol",
        lastName: "Tan",
        email: "carol@example.com",
        phone: "0822222222",
        dateOfBirth: "01/03/1985",
        status: "inactive",
        address: {
          line1: "77 Park",
          city: "Phuket",
          state: "Phuket",
          postalCode: "83000",
          country: "Thailand",
        },
        preferences: {
          allowMarketing: false,
        },
      });

    const profileId = createResponse.body.resultData.id as number;

    const updateResponse = await request(app)
      .post("/api/profiles/update")
      .send({
        id: profileId,
        phone: "0899999999",
      });

    expect(updateResponse.status).toBe(409);
    expect(updateResponse.body).toEqual({
      resultCode: 409,
      resultMessage: "Inactive profile cannot be updated",
    });
  });

  it("returns 400 for invalid create payload", async () => {
    const app = createApp();

    const response = await request(app)
      .post("/api/profiles/create")
      .send({
        firstName: "OnlyName",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      resultCode: 400,
      resultMessage: "Invalid profile payload",
    });
  });
});
