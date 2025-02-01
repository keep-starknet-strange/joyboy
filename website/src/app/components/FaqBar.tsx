import React from 'react';
import Image from 'next/image';
type Props = {
  answer: string;
  question: string;
  isOpen: boolean;
  onClick: () => void;
};

export function FaqBar({question, answer, isOpen, onClick}: Props) {
  return (
    <>
      <button
        onClick={onClick}
        className="py-4 tab:py-[32px] px-3 tab:px-[25px] border-[1px] border-[#C9C9C9] text-white bg-black rounded-xl max-w-[871px] desktop:w-[871px] w-full"
      >
        <div className="flex justify-between items-center">
          <h2 className="desktop:text-[20px] text-xs leading-[28px]">{question}</h2>
          <Image
            width={20}
            height={20}
            src="/assets/down-cheveron.svg"
            alt="Toggle"
            className={isOpen ? 'transform rotate-180' : 'transform rotate-0'}
          />
        </div>
        {isOpen && (
          <div className="w-full text-start mt-6">
            <p>{answer}</p>
          </div>
        )}
      </button>
    </>
  );
}
