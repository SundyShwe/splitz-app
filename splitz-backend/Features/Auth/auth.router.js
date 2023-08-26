import { Router } from "express";
import {
  getAllUser,
  getUserByID,
  googleSignIn,
  singIn,
  singUp,
  updateUserByID,
} from "./auth.controller.js";

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

//@desc     Get All Users
//@route    GET auth/user
router.get("/user", getAllUser);

//@desc     Get user by Id
//@route    GET auth/user/:user_id
router.get("/user/:user_id", getUserByID);

//@desc     update User
//@route    POST auth/google
router.post("/user/:user_id", updateUserByID);

export default router;
