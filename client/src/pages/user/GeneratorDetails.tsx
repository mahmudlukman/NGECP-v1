import React from "react";
import { useParams } from "react-router-dom";
import { MapPin, Tag, Calendar, Cpu, Gauge, Battery, Info } from "lucide-react";
import { format } from "date-fns";
import { useGetGeneratorByIdQuery } from "../../redux/features/generator/generatorApi";
import DashboardLayout from "../../components/Layouts/DashboardLayout";

const GeneratorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch generator details from RTK Query API
  const { data, isLoading, isError } = useGetGeneratorByIdQuery(
    { id: id! },
    { skip: !id }
  );

  console.log("🧩 Generator ID from URL:", data);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-sm">Loading generator details...</p>
      </div>
    );
  }

  if (isError || !data?.generator) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-sm">Generator not found.</p>
      </div>
    );
  }

  const generator = data.generator;

  return (
    <DashboardLayout activeMenu="My Generators">
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6 p-6">
            {/* Image */}
            <div className="flex-shrink-0 w-full md:w-1/2">
              <img
                src={generator.image || "/placeholder-generator.jpg"}
                alt={generator.name}
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-between md:w-1/2">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {generator.name}
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <Tag className="w-4 h-4" /> {generator.brand}
                </p>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">Capacity:</span>{" "}
                    {generator.capacity} kVA
                  </p>
                  <p className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Fuel Type:</span>{" "}
                    {generator.fuelType}
                  </p>
                  <p className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Condition:</span>{" "}
                    {generator.condition}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="font-medium">Location:</span>{" "}
                    {generator.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">Date Added:</span>{" "}
                    {format(new Date(generator.createdAt), "PPP")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {generator.description && (
            <div className="border-t border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" />
                Description
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {generator.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GeneratorDetails;
