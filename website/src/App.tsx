import "./App.css";
import About from "./components/About";
import ContributeSection from "./components/ContributeSection";
import DescriptionSection from "./components/DescriptionSection";
import DownloadSection from "./components/DownloadSection";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import RetroLandingPage from "./components/RetroLandingPage";

function App() {
  return (
    <div className="min-h-screen w-full relative bg-black">
      <Navbar />
      <HeroSection />
      <About />
      <DescriptionSection />
      <div className="flex flex-col gap-y-[140px]">
        <ContributeSection />
        <DownloadSection />
        <Faq />
        <Footer />
      </div>
    </div>
  );
}

export default App;
