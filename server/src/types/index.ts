export interface IUser {
  _id: string;
  email: string;
  password: string;
  fullname: string;
  profilePic?: string | null;
  createdAt: string;
  updatedAt: string;
}
