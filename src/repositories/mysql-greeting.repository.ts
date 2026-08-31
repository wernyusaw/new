import { inject, injectable } from "tsyringe";

import { ServiceTokens } from "../di/injection-tokens";
import { getMySqlPool } from "../db/mysql";
import type { AppConfig } from "../interfaces/app-config";
import type { GreetingRepositoryPort } from "../interfaces/greeting-repository.port";

@injectable()
export class MySqlGreetingRepository implements GreetingRepositoryPort {
  public constructor(@inject(ServiceTokens.AppConfig) private readonly appConfig: AppConfig) {}

  public async saveGreeting(name: string, message: string): Promise<void> {
    const pool = await getMySqlPool(this.appConfig);

    // Use parameterized query to prevent SQL injection from user input.
    await pool.execute("INSERT INTO greetings (name, message) VALUES (?, ?)", [name, message]);
  }

  public async getGreetingByName(name: string): Promise<string | null> {
    const pool = await getMySqlPool(this.appConfig);

    const [rows] = await pool.execute("SELECT message FROM greetings WHERE name = ?", [name]);
    const result = rows as { message: string } [];
    return result.length > 0 ? result[0].message : null;
  }
}
