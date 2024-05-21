import { useState } from "react";
import downCheveron from "../assets/down-cheveron.svg";

const FaqBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="py-[32px] px-[25px] flex justify-between items-center text-white border-[1px] border-[#C9C9C9] bg-black rounded-xl max-w-[871px] w-[871px]">
      <h2 className="text-[20px] leading-[28px]">How do i Join Joyboy?</h2>
      <img src={downCheveron} alt="" />
    </div>
  );
};

export default FaqBar;
