import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/Layouts/DashboardLayout";

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout activeMenu="My Generators">
      <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
        <div className="text-red-500 text-4xl mb-4">❌</div>
        <h3 className="text-lg text-red-600 mb-2">Payment Failed</h3>
        <p className="text-gray-500 mb-4">
          There was an issue with your payment. Please try again.
        </p>
        <button
          onClick={() => navigate("/user/my-generators")}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:scale-103 active:scale-95 transition"
        >
          Return to Generators
        </button>
      </div>
    </DashboardLayout>
  );
};

export default PaymentFailure;