'use client';

import {motion} from 'framer-motion';

export function About() {
  return (
    <div className="bg-black py-[40px] tab:py-[140px] text-center text-white text-base tab:text-[32px] leading-[32px] desktop:leading-[50px] font-normal z-[50] relative px-6 desktop:px-[171px]">
      <motion.p
        animate={{x: [-100, 0]}}
        transition={{ease: 'easeOut', duration: 1}}
        className="gradient-text"
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
      >
        The name &quot;Joyboy&quot; is inspired by the character from the manga series &quot;One
        Piece&quot;. Joyboy is a mysterious figure from the Void Century who left behind a treasure
        called the &quot;One Piece&quot;. What if the treasure are the friends we made along the
        way? A decentralized social network should be a treasure trove of memories and connections.
      </motion.p>
    </div>
  );
}
