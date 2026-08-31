import { injectable } from "tsyringe";

import type { HelloServicePort } from "../interfaces/hello-service.port";
import { getHelloMessage } from "../usecases/getHelloMessageUsecase";

@injectable()
export class HelloService implements HelloServicePort {
  public buildMessage(name: string): string {
    return getHelloMessage(name);
  }
}
