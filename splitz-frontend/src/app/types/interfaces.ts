export interface IUser {
  fullname: string;
  email: string;
  password: string;
}

export interface IState {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  jwt: string;
}

export interface IGroup {
  _id: string;
  name: string;
  description: string;
  category: string;
  members: IMember[];
  member_names: string[];
  date: number;
}

export interface IGroupInfo {
  name: string;
  description: string;
  category: string;
  date: number;
}
export interface IMember {
  user_id: string;
  fullname: string;
  email: string;
}

export interface IBills {
  _id: string;
  title: string;
  description: string;
  icon: string;
  total_amount: number;
  group_id: string;
  paid_by: IPaid_By[];
  paid_by_names: string[];
  owed_by: IOwed_By[];
  category: string;
  receipt: IReceipt;
  date: number;
  remark: string;
}

export interface IPaid_By {
  user_id: string;
  fullname: string;
  paid_amount: number;
}
export interface IOwed_By {
  user_id: string;
  fullname: string;
  owed_amount: number;
  settled: boolean;
}

export interface IReceipt {
  filename: string;
  originalname: string;
}

export interface IOwed_Member {
  user_id: string;
  fullname: string;
  total_amount: number;
}

export const Initial_State = {
  _id: '',
  fullname: '',
  email: '',
  password: '',
  jwt: '',
};
