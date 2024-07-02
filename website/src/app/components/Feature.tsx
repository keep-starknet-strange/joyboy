type Props = {img: string; title: string; description: string};

export function Feature({img, title, description}: Props) {
  return (
    <div className="flex flex-col gap-y-3 tab:gap-y-[18px] items-center text-center">
      <div className="tab:p-7 p-3 rounded-[10px] border-[1px] border-solid border-white w-fit">
        <img src={img} className="" alt="" />
      </div>
      <h3 className="font-bold text-base tab:text-xl">{title}</h3>
      <p className="tab:text-base text-sm leading-[19px] tab:w-full w-[85%]">{description}</p>
    </div>
  );
}
