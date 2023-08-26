import { Router } from "express";
import {
  addNewBill,
  deleteBillByID,
  getAllBills,
  savePaidOwed,
  settleBill,
  updateBillByID,
  updatePaidOwed,
  viewBillByID,
} from "./bills.controller.js";
import multer from "multer";

const router = Router({ mergeParams: true });

//@desc     view all bills of a group
//@route    GET /groups/:group_id/bills
router.get("/", getAllBills);

//@desc     add new bill to the group
//@route    POST /groups/:group_id/bills
//router.post("/", upload.single("receipts"), addNewBill);
router.post("/", multer({ dest: "uploads/" }).single("receipt"), addNewBill);

//@desc     add paid_by and owed_by of the bill
//@route    POST /groups/:group_id/bills/:bill_id/paidowed
router.post("/:bill_id/paidowed", savePaidOwed);

//@desc     view the bill by ID
//@route    GET /groups/:group_id/bills/:bill_id
router.get("/:bill_id", viewBillByID);

//@desc     update the bill by ID
//@route    POST /groups/:group_id/bills/:bill_id
router.post(
  "/:bill_id",
  multer({ dest: "uploads/" }).single("receipt"),
  updateBillByID
);

//@desc     add paid_by and owed_by of the bill
//@route    POST /groups/:group_id/bills/:bill_id/paidowed
router.post("/:bill_id/updatepaidowed", updatePaidOwed);

//@desc     remove the bill by ID
//@route    POST /groups/:group_id/bills/:bill_id
router.delete("/:bill_id", deleteBillByID);

//@desc     settle the bill by loggine user
//@route    POST /groups/:group_id/bills/:bill_id/settle
router.post("/:bill_id/settle", settleBill);

export default router;
