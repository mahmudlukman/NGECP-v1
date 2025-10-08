import AboutSection from "../components/AboutSection";
import MainBanner from "../components/MainBanner";
import NewsLetter from "../components/NewsLetter";
import OurSpec from "../components/OurSpecs";

const Home = () => {
  return (
    <div className="mt-10">
      <MainBanner />
      <AboutSection />
      <OurSpec />
      <NewsLetter />
    </div>
  );
};

export default Home;
