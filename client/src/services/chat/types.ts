import { TMessage, TUser } from "../../types";

export type TGetUsersResponse = {
  message: string;
  users: TUser[];
};

export type TGetMessagesResponse = {
  message: string;
  messages: TMessage[];
};

export type TSendMessageResponse = {
  message: string;
  newMessage: TMessage;
};
