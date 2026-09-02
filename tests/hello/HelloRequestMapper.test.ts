import { describe, expect, it } from "@jest/globals";

import type { AppConfig } from "../../src/interfaces/app-config";
import { mapGetHelloRequest } from "../../src/mappers/request/hello-request.mapper";

const appConfigMock: AppConfig = {
  defaultName: "Saw",
  greetingStyle: "casual",
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

describe("hello request mapper", () => {
  it("uses default name when query.name is missing", () => {
    const request = { query: {} };

    expect(mapGetHelloRequest(request, appConfigMock)).toEqual({ name: "Saw" });
  });

  it("uses default name when query.name is not a string", () => {
    const request = { query: { name: 123 } };

    expect(mapGetHelloRequest(request, appConfigMock)).toEqual({ name: "Saw" });
  });

  it("uses default name when query.name is blank after trimming", () => {
    const request = { query: { name: "   " } };

    expect(mapGetHelloRequest(request, appConfigMock)).toEqual({ name: "Saw" });
  });

  it("trims and returns the provided query.name", () => {
    const request = { query: { name: "  Tom  " } };

    expect(mapGetHelloRequest(request, appConfigMock)).toEqual({ name: "Tom" });
  });

  it("uses default name when query.name exceeds the database limit", () => {
    const request = { query: { name: "a".repeat(101) } };

    expect(mapGetHelloRequest(request, appConfigMock)).toEqual({ name: "Saw" });
  });
});
