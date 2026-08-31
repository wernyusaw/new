import { injectable } from "tsyringe";

import type { GreetingRepositoryPort } from "../interfaces/greeting-repository.port";

@injectable()
export class NoopGreetingRepository implements GreetingRepositoryPort {
  public async saveGreeting(_name: string, _message: string): Promise<void> {
    // Intentionally no-op when DB is not configured.
    return Promise.resolve();
  }

  public async getGreetingByName(_name: string): Promise<string | null> {
    return null;
  }
}
