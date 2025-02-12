import express from "express";
import { signup, login, getProfile } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";
const UserRouter = express.Router();

UserRouter.post("/signup", signup);
UserRouter.post("/login", login);
UserRouter.get("/profile/:id", authMiddleware,getProfile);

export default UserRouter;
