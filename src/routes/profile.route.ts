import { Router } from "express";
import { container } from "tsyringe";

import { ProfileController } from "../controllers/profile.controller";

export const profileRouter = Router();
const profileController = container.resolve(ProfileController);

profileRouter.post("/profiles/create", profileController.createProfile.bind(profileController));
profileRouter.get("/profiles/get", profileController.getProfileById.bind(profileController));
profileRouter.post("/profiles/update", profileController.updateProfile.bind(profileController));
