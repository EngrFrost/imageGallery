import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import GalleryPage from "../pages/GalleryPage";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/common/layout/AppLayout";
import { AuthProvider } from "../providers/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: (
              <AuthProvider>
                <AppLayout />
              </AuthProvider>
            ),
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
