export interface UserState {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  jwt: string;
}

export const Initial_State = {
  _id: '',
  fullname: '',
  email: '',
  password: '',
  jwt: '',
};
