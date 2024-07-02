'use client';

import {motion} from 'framer-motion';

export function DownloadSection() {
  return (
    <div className="desktop:pt-[84px] pt-[40px] pb-[50px] desktop:pb-[180px]  text-white text-center bg-gradientBg bg-center">
      <motion.div
        animate={{x: [-1200, 0]}}
        transition={{
          x: {duration: 1},
        }}
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        className="flex flex-col items-center"
      >
        <img
          src="/assets/logo.svg"
          className="desktop:h-[150px] desktop:w-[150px] h-[80px] w-[80px] mb-[13px]"
          alt=""
        />
        <h3 className="text-base desktop:text-[48px] font-bold mb-[21px] desktop:leading-[56px]">
          Download Joyboy
        </h3>
        <p className="text-sm desktop:text-[24px] desktop:leading-7 mb-6 tab:mb-[47px] desktop:w-[623px] w-[80%]">
          Joyboy is available on Android, iOS, iPadOS and macOS. It’s free and open source.
        </p>
        <div className="flex items-center gap-x-5">
          <button>
            <img src="/assets/appStoreBtn.svg" className="w-[100px] desktop:w-auto" alt="" />
          </button>
          <button>
            <img src="/assets/googlePlaybtn.svg" className="w-[100px] desktop:w-auto" alt="" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
