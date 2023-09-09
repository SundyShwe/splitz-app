import usersModel from "./auth.model.js";
import billModel from "../Bills/bills.model.js";
import bcrypt from "bcrypt";
import { ObjectId } from "bson";

export const getAllBillsUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const results = await billModel.aggregate([
      { $match: { paid_by: { $elemMatch: { user_id: new ObjectId(user_id) } } } },
      {
        $group: {
          _id: null,
          totalExp: { $sum: "$total_amount" },
        },
      },
      { $project: { _id: 0 } },
    ]);
    //console.log(results);
    results && res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

export const getPaidByUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const results = await billModel
      .find(
        {
          paid_by: { $elemMatch: { $and: [{ user_id: user_id }, { paid_amount: { $gt: 0 } }] } },
        },
        { _id: 0, "paid_by.$": 1, title: 1 }
      )
      .lean();
    // const results = await billModel.aggregate([
    //   { $unwind: "$paid_by" },
    //   { $match: { paid_by: { $elemMatch: { user_id: new ObjectId(user_id) } } } },
    //   { $match: { paid_by: { $elemMatch: { paid_amount: { $gt: 0 } } } } },
    //   //   { $project: { _id: 0, paid_by: 1 } },
    //   //   { $group: { _id: "$paid_by.user_id", totalPaid: { $sum: "$paid_by.paid_amount" } } },
    // ]);
    results && res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

export const getOwedByUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const results = await billModel
      .find(
        {
          owed_by: { $elemMatch: { $and: [{ user_id: user_id }, { owed_amount: { $gt: 0 } }] } },
        },
        { _id: 0, "owed_by.$": 1, title: 1 }
      )
      .lean();
    results && res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const plain_password = req.body.password;
    const tokenData = req.token;

    if (!plain_password) throw new Error(`Password not found`);
    const hashed_password = await bcrypt.hash(plain_password, 10);

    const results = await usersModel.updateOne(
      { _id: tokenData._id },
      {
        password: hashed_password,
      }
    );
    res.json({ success: true, data: results });
  } catch (err) {
    console.log("Error : ", err);
    next(err);
  }
};

export const getAllUser = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
export const getUserByID = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const updateUserByID = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
