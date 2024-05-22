import Feature from "./Feature";
import keyIcon from "../assets/key.svg";
import noAdIcon from "../assets/noAdIcon.svg";
import moneyIcon from "../assets/money-send.svg";
import saveYourKeysImg from "../assets/save-your-keys.png";
import { motion } from "framer-motion";

const DescriptionSection: React.FC = () => {
  return (
    <div className="pt-[112px] flex flex-col text-white items-center text-center px-[120px] bg-gradientBg bg-no-repeat bg-contain">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ ease: "easeOut", duration: 1 }}
        className="max-w-[951px] mb-[72px]"
      >
        <h1 className="text-[82px] font-bold">Your social network</h1>
        <p className="text-base leading-[30px] mt-4 text-[#9D9797]">
          A decentralized and open social network. Without ads, toxic
          algorithms, or censorship, JoyBoy grants you access to the social
          network that a genuinely free and healthy society necessitates — and
          merits.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ ease: "easeOut", duration: 1 }}
        className="flex items-center gap-x-6"
      >
        <Feature
          img={keyIcon}
          title="No Registration Required"
          description="No registration required. Use passkeys to log in and sign messages securely, ensuring your interactions remain private and effortless."
        />
        <Feature
          img={noAdIcon}
          title="No Advertisement"
          description="No registration required. Use passkeys to log in and sign messages securely, ensuring your interactions remain private and effortless."
        />
        <Feature
          img={moneyIcon}
          title="Social Payment"
          description="No registration required. Use passkeys to log in and sign messages securely, ensuring your interactions remain private and effortless."
        />
        <Feature
          img={keyIcon}
          title="No Registration Required"
          description="No registration required. Use passkeys to log in and sign messages securely, ensuring your interactions remain private and effortless."
        />
      </motion.div>
      <div className="pt-[140px] w-full">
        <div className="flex justify-center gap-x-[181px] mb-[280px]">
          <motion.div
            animate={{ x: [-1200, 0] }}
            transition={{
              x: { duration: 1 },
              ease: "easeOut",
              duration: 1,
            }}
            className="w-[788px] text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <h2 className="text-[82px] leading-[90px] mb-4">
              Absolute Freedom
            </h2>
            <h5 className="text-[24px] leading-10 text-[#9D9797] mb-6">
              Freedom requires censorship resistance, and Nostr provides exactly
              that.
            </h5>
            <p className="text-base leading-10">
              Freedom requires censorship resistance, and Nostr provides exactly
              that. JoyBoy leverages Nostr’s decentralized and open social
              network to give you a platform free from ads, toxic algorithms,
              and censorship. With Nostr, your social interactions are
              safeguarded from any centralized control, ensuring your voice is
              heard without interference.
            </p>
          </motion.div>
          <motion.img
            src={saveYourKeysImg}
            alt=""
            animate={{ x: [1200, 0] }}
            transition={{
              x: { duration: 1 },
              ease: "easeOut",
              duration: 1,
            }}
          />
        </div>
        <div className="flex justify-center gap-x-[181px] mb-[280px]">
          <motion.img
            src={saveYourKeysImg}
            alt=""
            animate={{ x: [-1200, 0] }}
            transition={{
              x: { duration: 1 },
              ease: "easeOut",
              duration: 1,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          />
          <motion.div
            animate={{ x: [1200, 0] }}
            transition={{
              x: { duration: 1 },
              ease: "easeOut",
              duration: 1,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="w-[788px] text-left"
          >
            <h2 className="text-[82px] leading-[90px] mb-4">
              Enhanced by StarkNet Account Abstraction
            </h2>
            <h5 className="text-[24px] leading-10 text-[#9D9797] mb-6">
              Combining the power of Nostr with StarkNet's account abstraction
            </h5>
            <p className="text-base leading-10">
              JoyBoy offers an unparalleled user experience. StarkNet’s layer 2
              scaling solutions ensure smooth, cost-efficient transactions and
              interactions, while account abstraction simplifies user
              authentication and management.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionSection;
