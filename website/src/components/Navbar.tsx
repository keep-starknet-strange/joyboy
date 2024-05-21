import React from "react";
import logo from "../assets/logo.svg";
import NavigationLinks from "./NavigationLinks";
const Navbar: React.FC = () => {
  return (
    <div className="py-[26px] px-[120px] bg-black flex justify-between items-center">
      <div className="flex items-center gap-x-[10px] text">
        <img src={logo} className="h-[52px] w-[52px]" alt="" />
        <h5 className="text-2xl leading-7 font-bold text-white">Joyboy</h5>
      </div>
      <NavigationLinks />
      <div className="flex items-center gap-x-4 font-bold text-sm leading-[16px]">
        <button className="py-[15px] px-[48px] bg-[#8DAEF1]">Sign up</button>
        <button className="py-[15px] px-[48px] bg-white">Log in</button>
      </div>
    </div>
  );
};

export default Navbar;
