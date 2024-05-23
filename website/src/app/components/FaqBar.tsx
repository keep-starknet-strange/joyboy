"use client";

import { useState } from "react";
type Props = { answer: string; question: string };

export function FaqBar({ question, answer }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="py-4 tab:py-[32px] px-3 tab:px-[25px] flex justify-between items-center text-white border-[1px] border-[#C9C9C9] bg-black rounded-xl max-w-[871px] desktop:w-[871px] w-full">
      <h2 className="desktop:text-[20px] text-xs leading-[28px]">{question}</h2>
      <img src="/assets/down-cheveron.svg" alt="" />
    </div>
  );
};
