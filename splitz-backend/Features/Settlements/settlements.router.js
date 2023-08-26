import { Router } from "express";
import {
  getAllSettlments,
  settleAllWithAFriend,
  settleforABill,
} from "./settlements.controllers.js";

const router = Router();

export default router;

//@desc     view all settlements for a user
//@route    GET /settlements
router.get("/", getAllSettlments);

//@desc     settle all with a friend
//@route    post /settlements/:to_user
router.post("/:to_user", settleAllWithAFriend);

//@desc     settle for a bill with a friend
//@route    post /settlements/:to_user/:bill_id
router.post("/:to_user/:bill_id", settleforABill);
