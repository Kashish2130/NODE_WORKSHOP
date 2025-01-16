import express from 'express';
import {createUser,loginUser} from '../controller/authController.js'

const authRouter = express.Router();

authRouter.post("/signup",createUser);
authRouter.post("/login",loginUser);

export default authRouter;