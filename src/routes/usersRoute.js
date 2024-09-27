import { Router } from "express";
import { checkDataBodyUser } from "../middlewares/checkDataUsers.js";
import { User } from "../controllers/userController.js"

const route = Router();

route.post("/create", checkDataBodyUser, User.store)

export default route