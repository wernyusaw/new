import { describe, expect, it } from "@jest/globals";

import type { AppConfig } from "../../../src/interfaces/app-config";
import { mapGetGreetingByNameRequest, mapGetGreetingRequest } from "../../../src/mappers/request/greeting-request.mapper";

const appConfigMock: AppConfig = {
  defaultName: "Saw",
  greetingStyle: "formal",
  dbHost: "localhost",
  dbPort: 3306,
  dbUser: "app_user",
  dbPassword: "app_password",
  dbName: "app_db",
  kafkaEnabled: false,
  kafkaBrokers: ["localhost:9092"],
  kafkaClientId: "simple-ts-express",
  kafkaTopicGreetingCreated: "greeting.created",
};

describe("greeting request mapper", () => {
  it("uses default name when query.name is missing", () => {
    const request: Parameters<typeof mapGetGreetingRequest>[0] = {
      query: {},
    };

    expect(mapGetGreetingRequest(request, appConfigMock)).toEqual({ name: "Saw" });
  });

  it("trims query.name and returns default when blank", () => {
    const request: Parameters<typeof mapGetGreetingRequest>[0] = {
      query: { name: "   " },
    };

    expect(mapGetGreetingRequest(request, appConfigMock)).toEqual({ name: "Saw" });
  });

  it("maps path param name and trims whitespace", () => {
    const request: Parameters<typeof mapGetGreetingByNameRequest>[0] = {
      params: { name: "  Tom  " },
    };

    expect(mapGetGreetingByNameRequest(request)).toEqual({ name: "Tom" });
  });
});
