export interface Group {
  _id: string;
  name: string;
  description: string;
  category: string;
  members: Member[];
  member_names: string[];
  date: number;
}

export interface GroupInfo {
  name: string;
  description: string;
  category: string;
  date: number;
}

export interface Member {
  user_id: string;
  fullname: string;
  email: string;
}
