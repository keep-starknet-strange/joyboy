export function Footer() {
  return (
    <div className="bg-footerBg bg-no-repeat bg-contain bg-black mt-0 tab:mt-[140px] pt-[200px] tab:pt-[514px] tab:px-[73px] px-6 pb-[42px] text-white">
      <div className="flex tab:flex-row flex-col items-center tab:items-start justify-between border-b-[1px] border-b-[#484040] border-b-solid pb-[30px]">
        <div className="flex flex-col items-center tab:items-start text-center tab:text-left">
          <img src="/assets/logo.svg" className="w-[80px] h-[80px] tab:h-auto tab:w-auto" alt="" />
          <p className="text-base leading-[18px] font-normal mt-[15px] tab:mb-[66px] mb-6 w-[278px]">
            Free, open-source decentralized social media platform.
          </p>
          <div className="flex items-center gap-x-5">
            <button>
              <img src="/assets/appStoreBtn.svg" className="w-[100px] tab:w-auto" alt="" />
            </button>
            <button>
              <img src="/assets/googlePlaybtn.svg" className="w-[100px] tab:w-auto" alt="" />
            </button>
          </div>
        </div>
        <div className="flex gap-x-[40px] tab:gap-x-[122px] text-[14px] leading-[21px] font-normal pt-[46px]">
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
        <div className="flex items-center gap-x-[14px] mt-5 tab:mt-0 self-center tab:self-end">
          <img src="/assets/facebookIcon.svg" alt="" />
          <img src="/assets/linkedinIcon.svg" alt="" />
          <img src="/assets/twitterIcon.svg" alt="" />
        </div>
      </div>
      <h6 className="text-xs tab:text-sm leading-[14px] font-normal text-center mt-4">
        © 2024 Joyboy. All Rights Reserved.
      </h6>
    </div>
  );
}
