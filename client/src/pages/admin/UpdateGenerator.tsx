import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetGeneratorByIdQuery,
  useUpdateGeneratorMutation,
} from "../../redux/features/generator/generatorApi";
import type { ServerError } from "../../@types";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import GeneratorLocationSelector from "../../components/GeneratorLocationSelector";
import Loading from "../../components/Loading";

const UpdateGenerator = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [yearOfManufacture, setYearOfManufacture] = useState("");
  const [fuelType, setFuelType] = useState("");

  const [location, setLocation] = useState({
    address: "",
    state: "",
    lga: "",
    coordinates: { latitude: 0, longitude: 0 },
  });

  // Fetch existing generator data
  const { data: generatorData, isLoading: isFetching } =
    useGetGeneratorByIdQuery({ id });

  const [updateGenerator, { isLoading: isUpdating }] =
    useUpdateGeneratorMutation();

  // Populate form with existing data once fetched
  useEffect(() => {
    if (generatorData?.generator) {
      const gen = generatorData.generator;
      setBrand(gen.brand || "");
      setModel(gen.model || "");
      setSerialNumber(gen.serialNumber || "");
      setCapacity(gen.capacity?.toString() || "");
      setYearOfManufacture(gen.yearOfManufacture?.toString() || "");
      setFuelType(gen.fuelType || "");

      setLocation({
        address: gen.location?.address || "",
        state: gen.location?.state || "",
        lga: gen.location?.lga || "",
        coordinates: {
          latitude: gen.location?.coordinates?.latitude || 0,
          longitude: gen.location?.coordinates?.longitude || 0,
        },
      });
    }
  }, [generatorData]);

  const handleLocationSelect = useCallback(
    (data: {
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
    },
    [],
  );

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

    const updatedData = {
      brand,
      model,
      serialNumber,
      capacity: Number(capacity),
      yearOfManufacture: Number(yearOfManufacture),
      fuelType,
      location,
    };

    try {
      await updateGenerator({ id, data: updatedData }).unwrap();
      toast.success("Generator updated successfully");

      setTimeout(() => {
        navigate("/admin/manage-generators", { replace: true });
      }, 100);
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError?.data?.message ||
        serverError?.message ||
        "Failed to update generator";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Generate year options from 1980 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1979 },
    (_, i) => currentYear - i,
  );

  if (isFetching) {
    return (
      <DashboardLayout activeMenu="Manage Generators">
        <Loading />
      </DashboardLayout>
    );
  }

  if (!generatorData?.generator) {
    return (
      <DashboardLayout activeMenu="Manage Generators">
        <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">Generator not found</p>
              <button
                onClick={() => navigate("/admin/manage-generators")}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer"
              >
                Back to Generators
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Manage Generators">
      <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
          <div className="flex items-center justify-between max-w-3xl mb-4">
            <h1 className="text-2xl text-slate-600 font-semibold">
              Update <span className="text-slate-800 font-bold">Generator</span>
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
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-primary text-slate-600"
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
                  className="w-full px-3 py-2 text-slate-600 border border-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-primary"
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
                className="w-full px-3 py-2 text-slate-600 border border-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-3 py-2 text-slate-600 border border-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-3 py-2 text-slate-600 border border-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-primary cursor-pointer"
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
                className="w-full px-3 py-2 text-slate-600 border border-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-primary cursor-pointer"
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
              onLocationSelect={handleLocationSelect}
              initialLocation={location}
            />

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg shadow hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
              >
                {isUpdating ? "Updating..." : "Update Generator"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                className="px-6 py-2.5 bg-gray-500 text-white font-medium rounded-lg shadow hover:bg-gray-600 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UpdateGenerator;
