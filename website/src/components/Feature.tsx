type Props = { img: string; title: string; description: string };

const Feature: React.FC<Props> = ({ img, title, description }) => {
  return (
    <div className="flex flex-col gap-y-[18px] items-center text-center">
      <div className="p-7 rounded-[10px] border-[1px] border-solid border-white w-fit">
        <img src={img} alt="" />
      </div>
      <h3 className="font-bold text-xl">{title}</h3>
      <p className="text-base leading-[19px]">{description}</p>
    </div>
  );
};

export default Feature;
