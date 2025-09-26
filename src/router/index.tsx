import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import GalleryPage from "../pages/GalleryPage";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/common/layout/AppLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                index: true,
                element: <GalleryPage />,
              },
            ],
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
