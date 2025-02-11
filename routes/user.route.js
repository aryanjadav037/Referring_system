import express from "express";
import { signup, login, getProfile } from "../controllers/user.controller.js";

const UserRouter = express.Router();

UserRouter.post("/signup", signup);
UserRouter.post("/login", login);
UserRouter.get("/profile/:id", getProfile);

export default UserRouter;
