import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./components/Layouts/MainLayout";
import Home from "./pages/Home";
import ResetPassword from "./pages/auth/ResetPassword";
import Activation from "./pages/auth/Activation";
import NotFound from "./pages/NotFound";
// import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/admin/Dashboard";
import PrivateRoute from "./utils/PrivateRoute";
import { useTokenRefresh } from "./utils/userRefreshToken";
import UserDashboard from "./pages/user/UserDashboard";
import MyGenerators from "./pages/user/MyGenerators";
import UserProfile from "./pages/user/UserProfile";
import ManageGenerators from "./pages/admin/ManageGenerators";
import ManageUsers from "./pages/admin/ManageUsers";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/activation/:activation_token", element: <Activation /> },
      {
        path: "/payment/callback",
        // element: <PaymentSuccessPage />,
      },
    ],
  },
  // admin protected routes
  {
    path: "/admin",
    element: <PrivateRoute allowedRoles={["admin", "editor"]} />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      { path: "manage-generators", element: <ManageGenerators /> },
      { path: "manage-users", element: <ManageUsers /> },
    ],
  },
  // user protected routes
  {
    path: "/user",
    element: <PrivateRoute allowedRoles={["user"]} />,
    children: [
      { path: "dashboard", element: <UserDashboard /> },
      { path: "generators", element: <MyGenerators /> },
      { path: "profile", element: <UserProfile /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

const App = () => {
  useTokenRefresh();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          style: { fontSize: "13px" },
        }}
      />
    </>
  );
};

export default App;
