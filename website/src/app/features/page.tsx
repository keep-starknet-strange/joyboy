import {ContributeSection} from '../components/ContributeSection';
import {Footer} from '../components/Footer';
import {Navbar} from '../components/Navbar';
import { DescriptionFeatures } from '../components/features/DescriptionFeatures';

export default function Features() {
  return (
    <div className="min-h-screen w-full relative bg-black">
      <Navbar />
      <DescriptionFeatures />
      <div className="flex flex-col desktop:gap-y-[80px] gap-y-[50px] mt-[50px] desktop:mt-[180px]">
        <ContributeSection />
      </div>
      <Footer />
    </div>
  );
}
