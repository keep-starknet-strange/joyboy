import githubLogo from "../assets/githubLogo.svg";
import githubLogoDark from "../assets/githubLogoDark.svg";
import gotTo from "../assets/go-to.svg";
import { motion } from "framer-motion";
const ContributeSection: React.FC = () => {
  return (
    <div className="pt-[84px]  text-white pb-[180px] bg-contributeBg">
      <motion.div
        animate={{ x: [-1200, 0] }}
        transition={{
          x: { duration: 1 },
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <img src={githubLogo} className="mb-4" alt="" />
        <h3 className="text-[48px] font-bold mb-[18px]">
          Contribute to Joyboy{" "}
        </h3>
        <p className="text-[24px] mb-10">
          Joyboy is available on iOS and Android. It's free and open source.
        </p>
        <button className="py-[15px] px-[42px] bg-white rounded-[5px] flex gap-x-[10px] items-center text-black">
          <img src={githubLogoDark} alt="" />
          See all issues on Github
          <img src={gotTo} alt="" />
        </button>
      </motion.div>
    </div>
  );
};

export default ContributeSection;
