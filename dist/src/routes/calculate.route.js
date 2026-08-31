"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRouter = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const calculate_controller_1 = require("../controllers/calculate.controller");
exports.calculateRouter = (0, express_1.Router)();
const calculateController = tsyringe_1.container.resolve(calculate_controller_1.CalculateController);
exports.calculateRouter.post("/calculate", calculateController.calculateValueChange.bind(calculateController));
