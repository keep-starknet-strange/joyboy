import logo from "../assets/logo.svg";
import appStore from "../assets/appStoreBtn.svg";
import googleStore from "../assets/googlePlaybtn.svg";
import { motion } from "framer-motion";
const DownloadSection: React.FC = () => {
  return (
    <div className="pt-[84px] pb-[177px]  text-white text-center bg-gradientBg">
      <motion.div
        animate={{ x: [-1200, 0] }}
        transition={{
          x: { duration: 1 },
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <img src={logo} className="h-[150px] w-[150px] mb-[13px]" alt="" />
        <h2 className="mb-[21px] text-[48px] leading-[56px]">
          Download Joyboy
        </h2>
        <p className="text-[24px] leading-7 mb-[47px] w-[623px]">
          Joyboy is available on Andriod, iOS, iPadOS and macOS. It's free and
          open source.
        </p>
        <div className="flex items-center gap-x-5">
          <button>
            <img src={appStore} alt="" />
          </button>
          <button>
            <img src={googleStore} alt="" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DownloadSection;
