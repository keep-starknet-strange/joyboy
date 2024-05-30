import {Helmet} from "react-helmet";
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
       <Helmet>
          <meta charSet="utf-8" />
          <title>Joyboy</title>
          <link rel="canonical" href="" />
          <meta name="description" content="Decentralized social built with Nostr and powered by Starknet account abstraction." />
      </Helmet>
      <Navbar />
      <HeroSection />
      <About />
      <DescriptionSection />
      <div className="flex flex-col desktop:gap-y-[80px] gap-y-[50px] mt-[50px] desktop:mt-[180px]">
        <ContributeSection />
        <DownloadSection />
        <Faq />
      </div>
      <Footer />
    </div>
  );
}

export default App;
