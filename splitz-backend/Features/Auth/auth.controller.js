import usersModel from "./auth.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const singIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await usersModel.findOne({ email }).lean();
    if (!user) throw new Error(`User not found`);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error(`Wrong password`);

    if (!process.env.JWT_PRIVATE_KEY) throw new Error("Could not sign token");

    const JWT = jwt.sign(
      { _id: user._id, fullname: user.fullname, email: user.email },
      process.env.JWT_PRIVATE_KEY
    );

    res.json({ success: true, data: JWT });
  } catch (err) {
    next(err);
  }
};
export const singUp = async (req, res, next) => {
  try {
    const new_user = req.body;
    const { password: plain_password } = new_user;

    if (!plain_password) throw new Error(`Password not found`);
    const hashed_password = await bcrypt.hash(plain_password, 10);

    let added_member = await usersModel
      .findOne({ email: new_user.email })
      .lean();

    //user aldy existed after adding to the group
    if (added_member) {
      const results = await usersModel.updateOne(
        { email: new_user.email },
        {
          fullname: new_user.fullname,
          password: hashed_password,
        }
      );
      res.json({ success: true, data: results });
    } else {
      const results = await usersModel.create({
        ...new_user,
        password: hashed_password,
      });
      res.json({ success: true, data: results });
    }
  } catch (err) {
    next(err);
  }
};

export const googleSignIn = async (req, res, next) => {
  try {
    const new_user = req.body;

    let added_member = await usersModel
      .findOne({ email: new_user.email })
      .lean();

    //save user if it is not existed in the system
    if (!added_member) {
      const results = await usersModel.create(new_user);
      added_member = {
        _id: results._id,
        fullname: new_user.fullname,
        email: new_user.email,
      };
    }

    if (!process.env.JWT_PRIVATE_KEY) throw new Error("Could not sign token");

    const JWT = jwt.sign(
      {
        _id: added_member._id,
        fullname: added_member.fullname,
        email: added_member.email,
      },
      process.env.JWT_PRIVATE_KEY
    );

    res.json({ success: true, data: JWT });
  } catch (err) {}
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
