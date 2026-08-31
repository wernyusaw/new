"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloRouter = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const hello_controller_1 = require("../controllers/hello.controller");
exports.helloRouter = (0, express_1.Router)();
const helloController = tsyringe_1.container.resolve(hello_controller_1.HelloController);
exports.helloRouter.get("/hello", helloController.getHello.bind(helloController));
