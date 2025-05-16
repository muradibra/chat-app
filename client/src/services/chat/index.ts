import axiosInstance from "../axiosInstance";
import {
  TGetMessagesResponse,
  TGetUsersResponse,
  TSendMessageResponse,
} from "./types";

const getUsers = async () => {
  const { data } = await axiosInstance.get<TGetUsersResponse>("/messages/user");
  return data;
};

const getMessages = async (userId: string) => {
  const { data } = await axiosInstance.get<TGetMessagesResponse>(
    `/messages/${userId}`
  );
  return data;
};

const sendMessage = async (messageData: any, selectedUserId: string) => {
  const { data } = await axiosInstance.post<TSendMessageResponse>(
    `/messages/send/${selectedUserId}`,
    messageData
  );
  return data;
};

const searchUser = async (searchValue: string) => {
  const { data } = await axiosInstance.get<TGetUsersResponse>(
    `/messages/user/search?fullname=${searchValue}`
  );
  return data;
};

const chatService = {
  getUsers,
  getMessages,
  sendMessage,
  searchUser,
};

export default chatService;
