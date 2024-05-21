import joyboy from "../assets/joyboyMascot.png";
import bg from "../assets/heroBg.jpeg";
import About from "./About";
import moon from "../assets/moon.svg";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  return (
    <div className="h-[900px] w-full overflow-hidden relative pt-[159px] flex justify-center bg-black bg-herobg bg-bottom bg-cover">
      <motion.img
        animate={{ x: [500, 0] }}
        transition={{
          x: { duration: 1 },
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        src={moon}
        className="absolute top-[36px] right-[150px]"
        alt=""
      />
      <motion.div
        animate={{ y: [1200, 0] }}
        transition={{
          y: { duration: 1 },
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="w-[773px] flex flex-col items-center text-white h-fit text-center relative z-[20]"
      >
        <h1 className="text-[72px] leading-[80px] mb-3">
          Step into a New Era of Social Networking
        </h1>
        <p className="text-[24px] leading-8 mb-8">
          Decentralized social built with Nostr and powered by Starknet account
          abstraction.
        </p>
        <div className="flex items-center gap-x-6 text-[18px] leading-[21px]">
          <button className="py-5 px-[72px] bg-black">Sign up</button>
          <button className="py-5 px-[56px] bg-white text-black">
            Download App
          </button>
        </div>
      </motion.div>
      <motion.img
        src={joyboy}
        className="absolute left-2 bottom-[49px] z-[250]"
        alt=""
        animate={{ x: [-500, 0] }}
        transition={{
          x: { duration: 1 },
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      />
    </div>
  );
};

export default HeroSection;
