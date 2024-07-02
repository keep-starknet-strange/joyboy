'use client';

import {FaqBar} from './FaqBar';

export function Faq() {
  return (
    <div className="desktop:pt-[84px] pt-[40px] pb-[44px] px-[24px] desktop:px-[320px] text-white text-center bg-gradientBg">
      <h2 className="mb-[49px] text-xl desktop:text-[32px] leading-[38px]">
        Frequently asked Questions
      </h2>
      <div className="flex flex-col gap-y-[24px] items-center w-full">
        <FaqBar question="How do i Join Joyboy?" answer="Joyboy" />
        <FaqBar question="What kind of contents can i post?" answer="" />
        <FaqBar question="How can i contribute to the Joyboy project?" answer="" />
        <FaqBar question="How can I jointhe Joyboy community?" answer="" />
      </div>
    </div>
  );
}
