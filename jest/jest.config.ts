import type { Config } from "jest";

const config: Config = {
  rootDir: "..",
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  setupFiles: ["<rootDir>/jest/jest.setup.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,
};

export default config;
