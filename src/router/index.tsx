import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import GalleryPage from '../pages/GalleryPage';
import App from '../App';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <GalleryPage />,
          },
        ],
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
