import groupsModel from "./groups.model.js";
import usersModel from "../Auth/auth.model.js";
import billsModel from "../Bills/bills.model.js";

export const createGroup = async (req, res, next) => {
  try {
    const tokenData = req.token;
    const new_group = {
      ...req.body,
      members: [
        {
          user_id: tokenData._id,
          fullname: tokenData.fullname,
          email: tokenData.email,
        },
      ],
    };
    //console.log(tokenData, new_group);

    const result = groupsModel.create(new_group);

    res.json({ success: true, data: result });
  } catch (err) {
    //console.log(err);
    next(err);
  }
};

export const getAllGroups = async (req, res, next) => {
  try {
    const tokenData = req.token;

    const results = await groupsModel
      .find({ members: { $elemMatch: { user_id: tokenData._id } } })
      .lean();
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

export const getGroupByID = async (req, res, next) => {
  try {
    const { group_id } = req.params;
    const results = await groupsModel.findById(group_id);
    //console.log(results);
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

export const updateGroupByID = async (req, res, next) => {
  try {
    const { group_id } = req.params;
    console.log(req.body);
    const { name, description, category, date } = req.body;
    const result = await groupsModel.updateOne(
      { _id: group_id },
      { $set: { name, description, category, date } }
    );
    console.log(result);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const deleteGroupByID = async (req, res, next) => {
  try {
    const { group_id } = req.params;
    //delete from groups
    let result = await groupsModel.deleteOne({ _id: group_id });
    //delete from bills
    result = await billsModel.delelteMany({
      group_id: group_id,
    });

    res.json({ success: true, data: result.modifiedCount ? true : false });
  } catch (err) {
    next(err);
  }
};

export const addMemberToGroup = async (req, res, next) => {
  try {
    const { group_id } = req.params;
    const tokenData = req.token;
    let member_to_add = await usersModel
      .findOne({ email: req.body.email })
      .lean();

    if (!member_to_add) {
      //temporay add
      const new_member = { email: req.body.email, fullname: req.body.fullname };
      const result = await usersModel.create(new_member);

      member_to_add = {
        _id: result._id,
        fullname: req.body.fullname,
        email: req.body.email,
      };
    }

    const results = await groupsModel.updateOne(
      {
        _id: group_id,
        members: { $elemMatch: { user_id: tokenData._id } },
      },
      {
        $addToSet: {
          members: {
            user_id: member_to_add._id,
            fullname: member_to_add.fullname,
            email: member_to_add.email,
          },
        },
      }
    );
    res.json({ success: true, data: results.modifiedCount ? true : false });
  } catch (err) {
    next(err);
  }
};

export const getMembersOfGroup = async (req, res, next) => {
  try {
    const { group_id } = req.params;
    const results = await groupsModel.findOne({ _id: group_id });
    res.json({ success: true, data: results.members });
  } catch (err) {
    next(err);
  }
};

export const updateMemberPendingStatus = async (req, res, next) => {
  try {
    const { group_id, member_id } = req.params;
    const { tokenData } = req.body;
    if (member_id !== tokenData._id)
      throw new ErrorResponse(
        "User must change the status of their own account",
        404
      );

    const results = await groupsModel.updateOne(
      {
        _id: group_id,
        members: { $elemMatch: { user_id: member_id, pending: true } },
      },
      { $set: { "members.$.pending": false } }
    );
    res.json({ success: true, data: results.modifiedCount ? true : false });
  } catch (err) {
    next(err);
  }
};

export const removeMemberFromGroup = async (req, res, next) => {
  try {
    const { group_id, member_id } = req.params;
    const result = await groupsModel.findOneAndUpdate(
      { _id: group_id },
      {
        $pull: { members: { user_id: member_id } },
      }
    );

    res.json({ success: true, data: result.modifiedCount });
  } catch (err) {
    next(err);
  }
};
