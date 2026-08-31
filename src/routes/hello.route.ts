import { Router } from "express";
import { container } from "tsyringe";

import { HelloController } from "../controllers/hello.controller";

export const helloRouter = Router();
const helloController = container.resolve(HelloController);

helloRouter.get("/hello", helloController.getHello.bind(helloController));
