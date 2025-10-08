import { assets } from "../utils/data";

const AboutSection = () => {
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Image */}
        <div className="w-full md:w-1/2">
          <img
            src={assets.about_img}
            alt="About the Program"
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            About the{" "}
            <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)] bg-[length:200%_200%] animate-text-shine">
              Initiative
            </span>
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            The National Generator Emission Control Program (NGECP) is a
            government-driven initiative committed to promoting environmental
            sustainability across Nigeria. Our mission is to monitor, regulate,
            and minimize harmful emissions from generators, ensuring cleaner air
            and a healthier future for all.
          </p>

          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            Through modern technology, strict compliance frameworks, and public
            awareness campaigns, we aim to create an eco-friendly energy
            ecosystem that supports national growth while preserving our
            environment for future generations.
          </p>

          <ul className="space-y-3 text-slate-700">
            <li className="flex items-center text-sm gap-2">
              ✅ Promote sustainable generator use.
            </li>
            <li className="flex items-center text-sm gap-2">
              ✅ Enforce national emission standards.
            </li>
            <li className="flex items-center text-sm gap-2">
              ✅ Encourage renewable energy adoption.
            </li>
            <li className="flex items-center text-sm gap-2">
              ✅ Protect public health and the environment.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
