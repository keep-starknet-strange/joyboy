'use client';

import {motion} from 'framer-motion';

export function HeroSection() {
  return (
    <div className="desktop:h-[900px] h-[833px] w-full overflow-hidden relative pt-[98px] desktop:pt-[159px] flex justify-center bg-black desktop:bg-herobg bg-mobileHeroBg bg-no-repeat bg-bottom">
      <motion.img
        animate={{x: [500, 0]}}
        transition={{
          x: {duration: 1},
        }}
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        src="/assets/moon.svg"
        className="absolute top-5 desktop:top-[36px] right-[31px] desktop:right-[150px] w-[50px] desktop:w-auto"
        alt=""
      />
      <motion.div
        animate={{y: [1200, 0]}}
        transition={{
          y: {duration: 1},
        }}
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        className="desktop:w-[773px] w-[85%] flex flex-col items-center text-white h-fit text-center relative z-[270]"
      >
        <h1 className="desktop:text-[72px] text-[36px] leading-[50px] desktop:leading-[80px] mb-3">
          Step into a New Era of Social Networking
        </h1>
        <p className="desktop:text-[24px] text-base leading-8 mb-8">
          Decentralized social built with Nostr and powered by Starknet account abstraction.
        </p>
        <div className="flex desktop:flex-row flex-col items-center gap-y-4 gap-x-6 text-[18px] leading-[21px]">
          <button className="desktop:py-5 text-sm desktop:text-base py-3 px-4 bg-black w-[200px] border-white border-[1px] border-solid desktop:border-none">
            Sign up
          </button>
          <button className="desktop:py-5 text-sm text-black desktop:text-base py-3 px-4 bg-white w-[200px]">
            Download App
          </button>
        </div>
      </motion.div>
      <motion.img
        src="/assets/joyboyMascot.png"
        className="absolute left-[-31px] desktop:left-2 bottom-[39px] desktop:bottom-[49px] z-[250] desktop:w-[380px] w-[210px]"
        alt=""
        animate={{x: [-500, 0]}}
        transition={{
          x: {duration: 1},
        }}
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
      />
    </div>
  );
}
