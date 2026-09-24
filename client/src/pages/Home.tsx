import React from "react";
import MainBanner from "../components/MainBanner";
import AboutSection from "../components/AboutSection";
import OurSpec from "../components/OurSpecs";
import FAQSection from "../components/FAQ";
import NewsLetter from "../components/NewsLetter";

const Home: React.FC = () => {
  return (
    <div className="w-full">
      <MainBanner />
      <AboutSection />
      <OurSpec />
      <FAQSection />
      <NewsLetter />
    </div>
  );
};

export default Home;
