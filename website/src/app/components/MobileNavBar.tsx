'use client';

import {motion} from 'framer-motion';
import {useEffect} from 'react';

type Props = {setToggle: any; toggle: boolean};

export function MobileNavBar({setToggle, toggle}: Props) {
  const parentAnimationVariants = {
    init: {
      scale: 0,
    },
    animate: {
      scale: 1,
    },
  };
  const toggleNav = () => {
    setToggle((prev: any) => !prev);
  };

  useEffect(() => {
    if (toggle) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [toggle]);

  return (
    <div className="absolute inset-0 z-[900] bg-redPrimary backdrop-blur-[30px] lg:hidden">
      <div className={`list-none pt-[60px] text-center text-white`}>
        <div className="absolute right-[51px] top-[39px] h-fit w-fit" onClick={toggleNav}>
          <img src="/assets/cancel-icon.svg" alt="" />
        </div>

        <motion.div
          variants={parentAnimationVariants}
          initial="init"
          animate="animate"
          exit={'init'}
          transition={{
            ease: 'easeInOut',
            type: 'string',
          }}
          className="flex h-full w-full items-center justify-center rounded-md bg-redPrimary p-2 text-center"
        >
          <ul className="flex w-[90%] flex-col gap-8 text-left">
            <li className="">Servers</li>
            <li className="">Features</li>
            <li className="">Ecosystem</li>
            <li className="">Developers</li>
            <li>
              <button className="py-[12px] w-[145px] bg-[#8DAEF1]">Sign up</button>
            </li>
            <li>
              <button className="py-[12px] w-[145px] bg-white text-black">Log in</button>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
