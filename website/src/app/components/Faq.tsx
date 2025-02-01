'use client';
import {useState} from 'react';
import {FaqBar} from './FaqBar';

export function Faq() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqData = [
    {
      question: 'How do I join Joyboy?',
      answer:
        'Visit our mobile app and website. Join the Joyboy Community on Telegram, debate, discuss, and contribute to the Freedom vision.',
    },
    {
      question: 'What kind of contents can I post?',
      answer:
        "Whatever, it's a Censorship resistant Social Network and Graph. Express yourself, discuss, debate, see others content based on your interests and friends!",
    },
    {
      question: 'How can I contribute to the Joyboy project?',
      answer:
        "Join us on Joyboy and Telegram! You can contribute in different way: as Content creator, Marketer, Dev or just a friend, it's a community project that collaborate for our vision!",
    },
    {
      question: 'How can I join the Joyboy community?',
      answer:
        "It's a Freedom place. Everyone can join and use our Social network, and be a part of the community and contributors!",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="desktop:pt-[84px] pt-[40px] pb-[44px] px-[24px] desktop:px-[320px] text-white text-center bg-gradientBg">
      <h2 className="mb-[49px] text-xl desktop:text-[32px] leading-[38px]">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col gap-y-[24px] items-center w-full">
        {faqData.map((item, index: number) => (
          <FaqBar
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openQuestion === index}
            onClick={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  );
}
