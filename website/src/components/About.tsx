import { motion } from "framer-motion";
const About: React.FC = () => {
  return (
    <div className="bg-black py-[140px] text-center text-white text-[32px] leading-[50px] font-normal z-[50] relative px-[171px]">
      <motion.p
        animate={{ x: 100 }}
        transition={{ ease: "easeOut", duration: 1 }}
        className="gradient-text"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        The name "Joyboy" is inspired by the character from the manga series
        "One Piece". Joyboy is a mysterious figure from the Void Century who
        left behind a treasure called the "One Piece". What if the treasure are
        the friends we made along the way? A decentralized social network should
        be a treasure trove of memories and connections.
      </motion.p>
    </div>
  );
};

export default About;
