export type TUser = {
  _id: string;
  fullname: string;
  email: string;
  profilePic: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TMessage = {
  senderId: string;
  receiverId: string;
  text: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};
