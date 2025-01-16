import express from "express";
import { getAllUsers } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.get("/",getAllUsers);

export default userRouter;