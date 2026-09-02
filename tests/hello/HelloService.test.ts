import { describe, expect, it, jest } from "@jest/globals";

import { HelloService } from "../../src/services/hello.service";
import * as helloUsecaseModule from "../../src/usecases/getHelloMessageUsecase";

jest.mock("../../src/usecases/getHelloMessageUsecase");

describe("HelloService", () => {
  it("delegates buildMessage to the usecase and returns its result", () => {
    // Arrange
    jest.spyOn(helloUsecaseModule, "getHelloMessage").mockReturnValue("Hello, Saw");
    const service = new HelloService();

    // Act
    const result = service.buildMessage("Saw");

    // Assert
    expect(helloUsecaseModule.getHelloMessage).toHaveBeenCalledWith("Saw");
    expect(result).toBe("Hello, Saw");
  });
});
