import logo from "../assets/logo.svg";
import appStore from "../assets/appStoreBtn.svg";
import googleStore from "../assets/googlePlaybtn.svg";
import facebook from "../assets/facebookIcon.svg";
import linkedin from "../assets/linkedinIcon.svg";
import twitter from "../assets/twitterIcon.svg";

const Footer: React.FC = () => {
  return (
    <div className="bg-footerBg bg-no-repeat bg-cover bg-black pt-[514px] px-[73px] pb-[42px] text-white">
      <div className="flex justify-between border-b-[1px] border-b-[#484040] border-b-solid pb-[30px]">
        <div>
          <img src={logo} alt="" />
          <p className="text-base leading-[18px] font-normal mt-[15px] mb-[66px] w-[278px]">
            Free, open-source decentralized social media platform.
          </p>
          <div className="flex items-center gap-x-5">
            <button>
              <img src={appStore} alt="" />
            </button>
            <button>
              <img src={googleStore} alt="" />
            </button>
          </div>
        </div>
        <div className="flex gap-x-[122px] text-[14px] leading-[21px] font-normal pt-[46px]">
          <ul className="flex flex-col gap-y-10">
            <li className="font-bold text-base leading-6">Company</li>
            <li>Sobre Nosotros</li>
            <li>Soluciones</li>
            <li>Insights</li>
          </ul>
          <ul className="flex flex-col gap-y-10">
            <li className="font-bold text-base leading-6">Product</li>
            <li>Contratar Talento</li>
            <li>Desarrollar Talento</li>
            <li>Herramientas de Gamificación</li>
          </ul>
        </div>
        <div className="flex items-center gap-x-[14px] self-end">
          <img src={facebook} alt="" />
          <img src={linkedin} alt="" />
          <img src={twitter} alt="" />
        </div>
      </div>
      <h6 className="text-sm leading-[14px] font-normal text-center mt-4">
        © 2024 Joyboy. All Rights Reserved.
      </h6>
    </div>
  );
};

export default Footer;
