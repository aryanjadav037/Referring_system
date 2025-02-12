import express from "express";
import { signup, login, getProfile ,getUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";
const UserRouter = express.Router();

UserRouter.post("/signup", signup);
UserRouter.post("/login", login);
UserRouter.get("/getprofile/:id", authMiddleware,getProfile);
UserRouter.get("/getuser", authMiddleware,getUser);

export default UserRouter;
