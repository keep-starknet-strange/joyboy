const NavigationLinks: React.FC = () => {
  return (
    <ul className="items-center gap-x-[32px] font-normal text-lg leading-[21px] text-white hidden desktop:flex">
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li>Ecosystem</li>
      <li><a href="/docs">Docs</a></li>
    </ul>
  );
};

export default NavigationLinks;
