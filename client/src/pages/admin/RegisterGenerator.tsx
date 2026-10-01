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

  const inputClass =
    "w-full px-3 py-2 border border-[#0B1F1A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#16785A]/20 focus:border-[#16785A] bg-[#F7F6F1] text-[#0B1F1A]";
  const labelClass = "text-sm font-medium text-[#0B1F1A]/70";

  return (
    <DashboardLayout>
      <div className="my-5 w-full rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-[0_20px_40px_-30px_rgba(11,31,26,0.25)]">
        <div className="no-scrollbar flex h-[95vh] flex-1 flex-col justify-between overflow-y-scroll">
          <div className="mb-4 flex max-w-3xl items-center justify-between">
            <h1 className="font-[Newsreader,Georgia,serif] text-2xl font-normal text-[#0B1F1A]/70">
              Register{" "}
              <span className="font-medium text-[#0B1F1A]">Generator</span>
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w-3xl space-y-5 p-4 md:p-10"
          >
            {/* Brand & Model */}
            <div className="flex flex-wrap gap-5">
              <div className="flex flex-1 flex-col gap-1">
                <label className={labelClass}>
                  Brand <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Perkins"
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label className={labelClass}>
                  Model <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. 404D-22G"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Serial Number */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>
                Serial Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Unique serial number"
                className={inputClass}
                required
              />
            </div>

            {/* Capacity & Year */}
            <div className="flex flex-wrap gap-5">
              <div className="flex flex-1 flex-col gap-1">
                <label className={labelClass}>
                  Capacity (KVA) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 150"
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label className={labelClass}>
                  Year of Manufacture <span className="text-rose-500">*</span>
                </label>
                <select
                  value={yearOfManufacture}
                  onChange={(e) => setYearOfManufacture(e.target.value)}
                  className={inputClass}
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
              <label className={labelClass}>
                Fuel Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className={inputClass}
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
            <h3 className="mt-6 font-[Newsreader,Georgia,serif] text-lg font-normal text-[#0B1F1A]">
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
              className="w-full cursor-pointer rounded-lg bg-[#0B1F1A] px-6 py-2.5 font-medium text-[#F3F1EA] shadow-sm transition hover:bg-[#12332b] disabled:opacity-50 md:w-auto"
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
