import { Router } from "express";
import { container } from "tsyringe";

import { CalculateController } from "../controllers/calculate.controller";

export const calculateRouter = Router();
const calculateController = container.resolve(CalculateController);

calculateRouter.post("/calculate", calculateController.calculateValueChange.bind(calculateController));