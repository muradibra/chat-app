import { create } from "zustand";
import chatService from "../services/chat";
import { TMessage, TUser } from "../types";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

interface ChatState {
  messages: any[];
  isMessagesLoading: boolean;
  allUsers: TUser[];
  isUsersLoading: boolean;
  selectedUser: TUser | null;
  isSearchUsers: boolean;
  setSelectedUser: (selectedUser: TUser | null) => void;
  getUsers: () => Promise<void>;
  searchUsers: (searchValue: string) => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: any) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isMessagesLoading: false,
  allUsers: [],
  isUsersLoading: false,
  selectedUser: null,
  isSearchUsers: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const data = await chatService.getUsers();
      const users = data?.users;
      set({ allUsers: users });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  searchUsers: async (searchValue: string) => {
    set({ isSearchUsers: true });
    try {
      const { users } = await chatService.searchUser(searchValue);
      set({ allUsers: users });
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      set({ isSearchUsers: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const data = await chatService.getMessages(userId);
      const messages = data?.messages;
      set({ messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData: { text: string; image: string | null }) => {
    const { selectedUser, messages } = get();
    try {
      const { newMessage } = await chatService.sendMessage(
        messageData,
        selectedUser?._id!
      );
      set({ messages: [...messages, newMessage] });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error?.response?.data?.message || "Error sending message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage: TMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;

      if (!isMessageSentFromSelectedUser) return;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser: TUser | null) => set({ selectedUser }),
}));
