import { Router } from "express";
import { getAllUser, getUserByID, updateUserByID, changePassword, getAllBillsUser, getPaidByUser, getOwedByUser } from "./user.controller.js";

const router = Router({ mergeParams: true });

//@desc     view all bills of User Id's groups
//@route    GET /user/:user_id/bills
router.get("/:user_id/bills", getAllBillsUser);

//@desc     view all bills  paid by User Id
//@route    GET /user/:user_id/bills/userpaid
router.get("/:user_id/bills/userpaid", getPaidByUser);

//@desc     view all bills owed by User Id
//@route    GET /user/:user_id/bills/userowed
router.get("/:user_id/bills/userowed", getOwedByUser);

//@desc     Change Password
//@route    POST /user/:user_id//changepassword
router.post("/:user_id/changepassword", changePassword);

//@desc     Get All Users
//@route    GET auth/user
router.get("/", getAllUser);

//@desc     Get user by Id
//@route    GET auth/user/:user_id
router.get("/:user_id", getUserByID);

//@desc     update User
//@route    POST auth/google
router.post("/:user_id", updateUserByID);

export default router;
