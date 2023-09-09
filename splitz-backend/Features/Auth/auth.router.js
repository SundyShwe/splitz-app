import { Router } from "express";
import { googleSignIn, singIn, singUp } from "./auth.controller.js";

const router = Router();

//@desc     Sign In
//@route    POST auth/signin
router.post("/signin", singIn);

//@desc     Register
//@route    POST auth/signup
router.post("/signup", singUp);

//@desc     Google Sign In
//@route    POST auth/google
router.post("/google", googleSignIn);

export default router;
