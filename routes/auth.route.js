import { Router } from "express";

import { signIn } from "../controller/auth.controller.js";
import { signUp } from "../controller/auth.controller.js";


const authRouter = new Router()

authRouter.post("/signin",signIn)
authRouter.post("/signup",signUp)

export { authRouter } 
