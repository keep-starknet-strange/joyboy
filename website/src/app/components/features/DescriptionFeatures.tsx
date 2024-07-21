'use client';

import { motion } from 'framer-motion';

import { Feature } from '../Feature';

export function DescriptionFeatures() {
  return (
    <div className="flex flex-col items-center text-center text-white  px-6 desktop:px-[120px] bg-gradientBg bg-no-repeat bg-contain">
      <div className="desktop:py-[112px] py-[50px] flex flex-col items-center desktop:gap-y-[72px] gap-y-[36px]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: 'easeOut', duration: 1 }}
          className="max-w-[951px] mb-6 tab:mb-[72px]"
        >
          <h1 className="text-xl tab:text-[82px] leading-5 tab:leading-[82px] font-bold">
            Freedom and Fair place
          </h1>
          <p className="text-sm tab:text-base leading-[30px] mt-4 text-[#9D9797]">

            Joyboy grants you access to the social network and payment that a genuinely free and healthy society
            necessitates — and merits.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: 'easeOut', duration: 1 }}
          className="flex desktop:flex-row flex-col items-center gap-6"
        >
          <Feature
            img="/assets/key.svg"
            title="Own your keys, own your destiny"
            description="Take the control of your own Identity, Money, Content and Data. "
          />
          <Feature
            img="/assets/money-send.svg"
            title="Payment & Finance"
            description="You can Tips, Pay, Progammable payment and Gift using Digital identites"
          />
          <Feature
            img="/assets/money-send.svg"
            title="Social graph"
            description="Social network for Community by interests, with privacy and data management."
          />
        </motion.div>
      </div>
      <div className="desktop:pt-[140px] pt-[50px] w-full">
        <div className="flex desktop:flex-row items-center desktop:items-start flex-col-reverse justify-center gap-y-7 gap-x-[181px] mb-[100px] desktop:mb-[280px]">
          <motion.div
            animate={{ x: [-1200, 0] }}
            transition={{
              x: { duration: 1 },
              ease: 'easeOut',
              duration: 1,
            }}
            className="desktop:w-[788px] desktop:text-left text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <h2 className="desktop:text-[82px] text-xl desktop:leading-[90px] desktop:mb-4 mb-3">
              Absolute Freedom and Ownership 
            </h2>
            <h5 className="desktop:text-[24px] text-base desktop:leading-10 text-[#9D9797] desktop:mb-6 mb-2">
              Freedom requires censorship resistance, and Nostr provides exactly that for your Identity, Money, Data & Content.
            </h5>
            <p className="text-sm leading-7 desktop:text-base desktop:leading-10">
              JoyBoy leverages Nostr’s decentralized and open social network to give you a platform and marketplace of the Content, DeSci, Education. Let's bring positivity and integrity to the world.
            </p>
          </motion.div>
          <motion.img
            src="/assets/home-page.png"
            alt=""
            style={{borderRadius:"15px"}}
            animate={{ x: [1200, 0] }}
            transition={{
              x: { duration: 1 },
              ease: 'easeOut',
              duration: 1,
            }}
          />
        </div>
        <div className="flex desktop:flex-row items-center desktop:items-start flex-col justify-center gap-y-7 gap-x-[181px]">
          <motion.img
            src="/assets/save-your-keys.png"
            alt=""
            animate={{ x: [-1200, 0] }}
            transition={{
              x: { duration: 1 },
              ease: 'easeOut',
              duration: 1,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          />
          <motion.div
            animate={{ x: [1200, 0] }}
            transition={{
              x: { duration: 1 },
              ease: 'easeOut',
              duration: 1,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="desktop:w-[788px] desktop:text-left text-center"
          >
            <h2 className="desktop:text-[82px] text-xl desktop:leading-[90px] desktop:mb-4 mb-3">
              Enhanced by StarkNet Account Abstraction
            </h2>
            <h5 className="desktop:text-[24px] text-base desktop:leading-10 text-[#9D9797] desktop:mb-6 mb-2">
              Combining the power of Nostr with StarkNet’s account abstraction
            </h5>
            <p className="text-sm leading-7 desktop:text-base desktop:leading-10">
              JoyBoy offers an unparalleled user experience. StarkNet’s layer 2 scaling solutions
              ensure smooth, cost-efficient transactions and interactions, while account abstraction
              simplifies user authentication and management.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
