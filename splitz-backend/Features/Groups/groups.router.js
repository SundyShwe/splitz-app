import { Router } from "express";
import {
  addMemberToGroup,
  createGroup,
  deleteGroupByID,
  getAllGroups,
  getGroupByID,
  getMembersOfGroup,
  removeMemberFromGroup,
  updateGroupByID,
  updateMemberPendingStatus,
} from "./groups.controller.js";
import billsRouter from "../Bills/bills.router.js";
const router = Router();

//@desc     create a group
//@route    POST /groups
router.post("/", createGroup);

//@desc     view all groups by logged in user
//@route    GET /groups/
router.get("/", getAllGroups);

//@desc     view a group details
//@route    GET /groups/:group_id
router.get("/:group_id", getGroupByID);

//@desc     update a group
//@route    POST /groups/:group_id
router.post("/:group_id", updateGroupByID);

//@desc     delete a group
//@route    DELETE /groups/:group_id
router.delete("/:group_id", deleteGroupByID);

//@desc     bills of the group
//@route    /groups/:group_id/bills
router.use("/:group_id/bills", billsRouter);

//@desc     get all members of a group
//@route    GET /groups/:group_id/members
router.get("/:group_id/members", getMembersOfGroup);

//@desc     add members to the group
//@route    POST /groups/:group_id/addmember
router.post("/:group_id/members", addMemberToGroup);

//@desc     update members pending status
//@route    POST /groups/:group_id/members/:member_id
router.post("/:group_id/members/:member_id", updateMemberPendingStatus);

//@desc     remove members to the group
//@route    POST /groups/:group_id/members/:member_id
router.delete("/:group_id/members/:member_id", removeMemberFromGroup);

export default router;
