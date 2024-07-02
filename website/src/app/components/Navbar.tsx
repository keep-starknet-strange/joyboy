'use client';

import React, {useState} from 'react';
import {createPortal} from 'react-dom';

import {MobileNavBar} from './MobileNavBar';
import {NavigationLinks} from './NavigationLinks';

export function Navbar() {
  const [toggleNav, setToggleNav] = useState(false);
  return (
    <div className="desktop:py-[26px] py-3 px-6 desktop:px-[120px] bg-black flex justify-between items-center">
      <div className="flex items-center gap-x-[10px] text">
        <img src="/assets/logo.svg" className="desktop:h-[52px] w-9 h-9 desktop:w-[52px]" alt="" />
        <h5 className="desktop:text-2xl text-lg leading-7 font-bold text-white">Joyboy</h5>
      </div>
      <NavigationLinks />
      <div className="desktop:flex hidden items-center gap-x-4 font-bold text-sm leading-[16px]">
        <button className="py-[15px] px-[48px] bg-[#8DAEF1]">Sign up</button>
        <button className="py-[15px] px-[48px] bg-white">Log in</button>
      </div>
      <button
        className="flex desktop:hidden"
        onClick={() => {
          setToggleNav(true);
          window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        }}
      >
        <img src="assets/hamburger-icon.svg" className="w-6 h-6" alt="" />
      </button>

      {toggleNav &&
        createPortal(<MobileNavBar setToggle={setToggleNav} toggle={toggleNav} />, document.body)}
    </div>
  );
}
