import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRegisterGeneratorMutation } from "../../redux/features/generator/generatorApi";
import type { ServerError } from "../../@types";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import GeneratorLocationSelector from "../../components/GeneratorLocationSelector";

const RegisterGenerator = () => {
  const navigate = useNavigate();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [yearOfManufacture, setYearOfManufacture] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [formKey, setFormKey] = useState(0);

  const [location, setLocation] = useState({
    address: "",
    state: "",
    lga: "",
    coordinates: { latitude: 0, longitude: 0 },
  });

  const [registerGenerator, { isLoading }] = useRegisterGeneratorMutation();

  const handleLocationSelect = (data: {
    address: string;
    state: string;
    lga: string;
    coordinates?: { latitude: number; longitude: number };
  }) => {
    setLocation({
      address: data.address,
      state: data.state,
      lga: data.lga,
      coordinates: data.coordinates || { latitude: 0, longitude: 0 },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !brand ||
      !model ||
      !serialNumber ||
      !capacity ||
      !yearOfManufacture ||
      !fuelType ||
      !location.state ||
      !location.lga
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const generatorData = {
      brand,
      model,
      serialNumber,
      capacity: Number(capacity),
      yearOfManufacture: Number(yearOfManufacture),
      fuelType,
      location,
    };

    try {
      await registerGenerator(generatorData).unwrap();
      toast.success("Generator registered successfully");

      // Reset form
      setBrand("");
      setModel("");
      setSerialNumber("");
      setCapacity("");
      setYearOfManufacture("");
      setFuelType("");
      setLocation({
        address: "",
        state: "",
        lga: "",
        coordinates: { latitude: 0, longitude: 0 },
      });
      setFormKey((prev) => prev + 1);

      // Optional: Navigate back to manage generators list after successful registration
      navigate("/admin/manage-generators");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError?.data?.message ||
        serverError?.message ||
        "Failed to register generator";
      toast.error(errorMessage);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1979 },
    (_, i) => currentYear - i,
  );

  return (
    <DashboardLayout activeMenu="Register Generator">
      <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
          <div className="flex items-center justify-between max-w-3xl mb-4">
            <h1 className="text-2xl text-slate-600 font-semibold">
              Register{" "}
              <span className="text-slate-800 font-bold">Generator</span>
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="md:p-10 p-4 space-y-5 max-w-3xl"
          >
            {/* Brand & Model */}
            <div className="flex flex-wrap gap-5">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-600">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Perkins"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary bg-gray-50 text-gray-700"
                  required
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-600">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. 404D-22G"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary bg-gray-50 text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Serial Number */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-600">
                Serial Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Unique serial number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary bg-gray-50 text-gray-700"
                required
              />
            </div>

            {/* Capacity & Year */}
            <div className="flex flex-wrap gap-5">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-600">
                  Capacity (KVA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary bg-gray-50 text-gray-700"
                  required
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-600">
                  Year of Manufacture <span className="text-red-500">*</span>
                </label>
                <select
                  value={yearOfManufacture}
                  onChange={(e) => setYearOfManufacture(e.target.value)}
                  className="w-full px-3 py-2 border text-slate-600 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary bg-gray-50"
                  required
                >
                  <option value="">Select year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fuel Type */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-600">
                Fuel Type <span className="text-red-500">*</span>
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full px-3 py-2 border text-slate-600 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary bg-gray-50"
                required
              >
                <option value="">Select fuel type</option>
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
                <option value="gas">Gas</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Location Section */}
            <h3 className="font-semibold text-slate-600 mt-6">
              Generator Location
            </h3>
            <GeneratorLocationSelector
              key={formKey}
              onLocationSelect={handleLocationSelect}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-6 py-2.5 bg-primary text-white font-medium rounded-lg shadow hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Registering..." : "Register Generator"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RegisterGenerator;
