import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useThemeStore } from "../store/useThemeStore";

function AuthLayout() {
  const { isCheckingAuth, authUser } = useAuthStore();
  const { theme } = useThemeStore();

  if (isCheckingAuth) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (authUser) {
    return <Navigate to="/" />;
  }

  return (
    <div data-theme={theme} className="h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default AuthLayout;
