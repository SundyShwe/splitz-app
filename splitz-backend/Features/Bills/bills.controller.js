import groupsModel from "../Groups/groups.model.js";
import billsModel from "./bills.model.js";

export const getAllBills = async (req, res, next) => {
  try {
    const { group_id } = req.params;
    //console.log(group_id);
    const results = await billsModel
      .find({
        group_id: group_id,
      })
      .lean();
    results && res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

export const addNewBill = async (req, res, next) => {
  try {
    const { group_id } = req.params;
    // console.log(req.params);
    const { title, description, category, total_amount, date } = req.body;
    let originalname = "",
      filename = "";
    if (req.file) {
      originalname = req.file.originalname;
      filename = req.file.filename;
    }
    const new_bill = {
      title,
      description,
      category,
      total_amount,
      date: Number(date),
      group_id,
      receipt: { filename, originalname },
    };
    //console.log(new_bill);
    const results = await billsModel.create(new_bill);
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

export const savePaidOwed = async (req, res, next) => {
  try {
    const { group_id, bill_id } = req.params;
    const { paid_by, owed_by } = req.body;
    console.log("saving paid owed" + paid_by, owed_by);
    let results = await billsModel.updateOne(
      {
        _id: bill_id,
      },
      { $push: { paid_by: { $each: paid_by } } }
    );
    results = await billsModel.updateOne(
      {
        _id: bill_id,
      },
      { $push: { owed_by: { $each: owed_by } } }
    );
    console.log(results);
    res.json({ success: true, data: results });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//update paid and owed
export const updatePaidOwed = async (req, res, next) => {
  try {
    const { group_id, bill_id } = req.params;
    const { paid_by, owed_by } = req.body;
    let results = await billsModel.updateOne(
      {
        _id: bill_id,
      },
      { $set: { paid_by: [], owed_by: [] } }
    );
    results = await billsModel.updateOne(
      {
        _id: bill_id,
      },
      { $push: { paid_by: { $each: paid_by }, owed_by: { $each: owed_by } } }
    );

    //console.log(results);
    res.json({ success: true, data: results });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//@route    GET /groups/:group_id/bills/:bill_id
export const viewBillByID = async (req, res, next) => {
  try {
    const { group_id, bill_id } = req.params;
    const results = await billsModel.findById(bill_id).lean();
    results && res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

export const updateBillByID = async (req, res, next) => {
  try {
    const { group_id, bill_id } = req.params;

    const { title, description, category, total_amount, date } = req.body;

    let originalname = "";
    let filename = "";
    if (req.file) {
      originalname = req.file.originalname;
      filename = req.file.filename;
    }

    const results = await billsModel.updateOne(
      { _id: bill_id },
      {
        $set: {
          title,
          description,
          category,
          total_amount,
          date,
          receipt: { filename, originalname },
        },
      }
    );
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

export const addSplitAmount = async (req, res, next) => {
  try {
    const { group_id, bill_id } = req.params;
    const { paid_by } = req.body;
    let result;
    for (let i = 0; i < paid_by.length; i++) {
      let user_amount = paid_by[i];
      result = await groupsModel.updateOne({ _id: bill_id }, { $addToSet: { paid_by: user_amount } });
    }
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const updateSplitAmount = async (req, res, next) => {
  try {
    const { group_id, bill_id } = req.params;
    const { paid_by } = req.body;
    let result;
    paid_by.forEach((e) => {
      groupsModel.updateOne({ _id: bill_id, "paidby.user_id": e.user_id }, { $set: { "paid_by.paid_amount": e.paid_amount } });
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBillByID = async (req, res, next) => {
  try {
    const { group_id, bill_id } = req.params;

    const results = await billsModel.deleteOne({
      _id: bill_id,
      group_id: group_id,
    });

    res.json({ success: true, data: results.modifiedCount ? true : false });
  } catch (err) {
    next(err);
  }
};

export const settleBill = async (req, res, next) => {
  const { group_id, bill_id } = req.params;
  const { tokenData } = res.body;
  const result = billsModel.updateOnd(
    { _id: bill_id, "owed_by.userId": tokenData._id },
    {
      $set: { "owed_by.$.settled": true },
    }
  );
};
