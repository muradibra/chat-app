import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";
import HomePage from "../pages/home";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/login";
import SignUpPage from "../pages/signUp";
import { PATHS } from "../constants";
import ProfilePage from "../pages/profile";
import SettingsPage from "../pages/settings";

const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: PATHS.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: PATHS.SETTINGS,
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "",
    element: <AuthLayout />,
    children: [
      {
        path: PATHS.AUTH.LOGIN,
        element: <LoginPage />,
      },
      {
        path: PATHS.AUTH.SIGNUP,
        element: <SignUpPage />,
      },
    ],
  },
  {
    path: PATHS.NOT_FOUND,
    element: (
      <div className="w-full h-[100vh] flex justify-center items-center">
        <h1 className="text-2xl text-red-500">404 Not Found</h1>
      </div>
    ),
  },
]);

export default router;
