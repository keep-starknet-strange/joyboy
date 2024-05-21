import logo from "../assets/logo.svg";
import appStore from "../assets/appStoreBtn.svg";
import googleStore from "../assets/googlePlaybtn.svg";
import FaqBar from "./FaqBar";
const Faq: React.FC = () => {
  return (
    <div className="pt-[84px] pb-[44px] px-[320px] text-white text-center bg-gradientBg">
      <h2 className="mb-[49px] text-[32px] leading-[38px]">
        Frequently asked Questions
      </h2>
      <div className="flex flex-col gap-y-[24px] items-center w-full">
        <FaqBar />
        <FaqBar />
        <FaqBar />
        <FaqBar />
        <FaqBar />
      </div>
    </div>
  );
};

export default Faq;
