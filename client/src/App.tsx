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
import RegisterGenerator from "./pages/admin/RegisterGenerator";
import UpdateGenerator from "./pages/user/UpdateGenerator";
import GeneratorsMapView from "./pages/admin/GeneratorsMapView";
import GeneratorDetails from "./pages/user/GeneratorDetails";
import MyGeneratorsMapView from "./pages/user/MyGeneratorsMapView";
import PaymentSuccessPage from "./pages/PaymentSuccess";
import Inspections from "./pages/admin/Inspections";
import WriteReport from "./pages/admin/WriteReport";
import Reports from "./pages/admin/Reports";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/activation/:activation_token", element: <Activation /> },
      { path: "/generator/:id", element: <GeneratorDetails /> },
      {
        path: "/payment/callback",
        element: <PaymentSuccessPage />,
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
      { path: "register-generator", element: <RegisterGenerator /> },
      { path: "generators-map-view", element: <GeneratorsMapView /> },
      { path: "manage-generators", element: <ManageGenerators /> },
      { path: "manage-users", element: <ManageUsers /> },
      { path: "inspections", element: <Inspections /> },
      { path: "write-report/:inspectionId", element: <WriteReport /> },
      { path: "reports", element: <Reports /> },
    ],
  },
  // user protected routes
  {
    path: "/user",
    element: <PrivateRoute allowedRoles={["user"]} />,
    children: [
      { path: "dashboard", element: <UserDashboard /> },
      { path: "register-generator", element: <RegisterGenerator /> },
      { path: "my-generators-map-view", element: <MyGeneratorsMapView /> },
      { path: "generators", element: <MyGenerators /> },
      { path: "update-generator/:id", element: <UpdateGenerator /> },
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
