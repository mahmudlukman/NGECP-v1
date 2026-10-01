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
    { skip: !id },
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-[#0B1F1A]/50">
            Loading generator details...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !data?.generator) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-rose-600">Generator not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  const generator = data.generator;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl p-6 font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
        <div className="overflow-hidden rounded-2xl border border-[#0B1F1A]/10 bg-white shadow-[0_20px_40px_-30px_rgba(11,31,26,0.25)]">
          {/* Header Section */}
          <div className="flex flex-col gap-6 p-6 md:flex-row">
            {/* Image */}
            <div className="w-full flex-shrink-0 md:w-1/2">
              <img
                src={generator.image || "/placeholder-generator.jpg"}
                alt={generator.name}
                className="h-64 w-full rounded-lg border border-[#0B1F1A]/10 object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-between md:w-1/2">
              <div>
                <h2 className="font-[Newsreader,Georgia,serif] text-2xl font-normal text-[#0B1F1A]">
                  {generator.name}
                </h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-[#0B1F1A]/50">
                  <Tag className="h-4 w-4" /> {generator.brand}
                </p>

                <div className="mt-4 space-y-2 text-sm text-[#0B1F1A]/75">
                  <p className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-[#16785A]" />
                    <span className="font-medium text-[#0B1F1A]">
                      Capacity:
                    </span>{" "}
                    {generator.capacity} kVA
                  </p>
                  <p className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-[#16785A]" />
                    <span className="font-medium text-[#0B1F1A]">
                      Fuel Type:
                    </span>{" "}
                    {generator.fuelType}
                  </p>
                  <p className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-[#16785A]" />
                    <span className="font-medium text-[#0B1F1A]">
                      Condition:
                    </span>{" "}
                    {generator.condition}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#16785A]" />
                    <span className="font-medium text-[#0B1F1A]">
                      Location:
                    </span>{" "}
                    {generator.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#16785A]" />
                    <span className="font-medium text-[#0B1F1A]">
                      Date Added:
                    </span>{" "}
                    {format(new Date(generator.createdAt), "PPP")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {generator.description && (
            <div className="border-t border-[#0B1F1A]/10 p-6">
              <h4 className="mb-2 flex items-center gap-2 font-[Newsreader,Georgia,serif] text-lg font-normal text-[#0B1F1A]">
                <Info className="h-4 w-4 text-[#16785A]" />
                Description
              </h4>
              <p className="text-sm leading-relaxed text-[#0B1F1A]/75">
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
