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
import Dashboard from "./pages/admin/Dashboard"
import PrivateRoute from "./utils/PrivateRoute";
import { useTokenRefresh } from "./utils/userRefreshToken";

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
      // user protected routes
      {
        path: "/user",
        element: <PrivateRoute allowedRoles={["user"]} />,
        children: [
          // { path: "add-address", element: <AddAddress /> },
          // { path: "my-orders", element: <MyOrders /> },
        ],
      },
    ],
  },
  // admin protected routes
  {
    path: "/admin",
    element: <PrivateRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      // { path: "my-orders", element: <MyOrders /> },
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
