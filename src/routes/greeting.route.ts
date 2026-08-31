import { Router } from "express";
import { container } from "tsyringe";

import { GreetingController } from "../controllers/greeting.controller";

export const greetingRouter = Router();
const greetingController = container.resolve(GreetingController);

greetingRouter.get("/greeting", greetingController.getGreeting.bind(greetingController));
greetingRouter.get("/greeting/:name", greetingController.getGreetingByName.bind(greetingController));
