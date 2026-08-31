export interface AppConfig {
  defaultName: string;
  greetingStyle: "casual" | "formal";
  dbHost: string;
  dbPort: number;
  dbUser: string;
  dbPassword: string;
  dbName: string;
  kafkaEnabled: boolean;
  kafkaBrokers: string[];
  kafkaClientId: string;
  kafkaTopicGreetingCreated: string;
}
