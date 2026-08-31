import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

import "./src/di/dependency-registry";
import { bootstrap } from "./Bootstrap";

bootstrap().catch((error: unknown) => {
	console.error("Failed to start application", error);
	process.exit(1);
});
