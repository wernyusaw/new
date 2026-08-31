export interface GreetingRepositoryPort {
  saveGreeting(name: string, message: string): Promise<void>;
  getGreetingByName(name: string): Promise<string | null>;
}
