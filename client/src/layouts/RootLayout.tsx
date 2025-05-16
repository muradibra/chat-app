import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { PATHS } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

function RootLayout() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (!authUser && location.pathname !== PATHS.SETTINGS) {
    return <Navigate to={PATHS.AUTH.LOGIN} />;
  }

  return (
    <div data-theme={theme} className="h-full">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default RootLayout;
