export interface Bills {
  _id: string;
  title: string;
  description: string;
  icon: string;
  total_amount: number;
  group_id: string;
  paid_by: Paid_By[];
  paid_by_names: string[];
  owed_by: Owed_By[];
  category: string;
  receipt: Receipt;
  date: number;
  remark: string;
}

export interface Paid_By {
  user_id: string;
  fullname: string;
  paid_amount: number;
}
export interface Owed_By {
  user_id: string;
  fullname: string;
  owed_amount: number;
  settled: boolean;
}

export interface Receipt {
  filename: string;
  originalname: string;
}

export interface Owed_Member {
  user_id: string;
  fullname: string;
  total_amount: number;
}
