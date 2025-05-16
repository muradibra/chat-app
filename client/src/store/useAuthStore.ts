import { create } from "zustand";
import toast from "react-hot-toast";
import authService from "../services/auth";
import { TUser } from "../types";

// import { io, Socket } from "socket.io-client";
import { io } from "socket.io-client";

interface AuthState {
  authUser: TUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => void;
  signUp: (data: {
    fullname: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  updateProfile: (data: { profilePic: string }) => Promise<void>;
  onlineUsers: string[];
  socket: any;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const { user } = await authService.checkAuth();
      set({ authUser: user });
      get().connectSocket();
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    try {
      set({ isSigningUp: true });
      const { user } = await authService.signUp(data);
      set({ authUser: user });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      console.error("Error signing up:", error);
      // toast.error((error as any).response?.data?.message || "Error signing up");
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      const { message } = await authService.logOut();
      toast.success(message || "Logout successful");
      set({ authUser: null });
      get().disconnectSocket();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const { user } = await authService.login(data);
      set({ authUser: user });
      toast.success("Login successful");
      get().connectSocket();
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error((error as any).response?.data?.message || "Error logging in");
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });
      const { message, user } = await authService.updateProfileInfo(data);
      set({ authUser: user });
      toast.success(message || "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      // toast.error((error as any).response?.data?.message || "Error updating profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const SERVER_URL =
      import.meta.env.VITE_SERVER_URL || "http://localhost:5001";

    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const sockett = io(SERVER_URL, {
      withCredentials: true,
      transports: ["websocket"],
      query: {
        userId: authUser._id,
      },
    });
    sockett.connect();

    sockett.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: sockett });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
      console.log("Socket disconnected");
    }
  },
}));
