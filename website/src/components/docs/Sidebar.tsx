import ListDropdown from "./ListDropdown";

const Sidebar: React.FC = () => {

    const items = [
        { label: 'Roadmap', href: '/docs/roadmap' },
        { label: 'Architecture', href: '/docs/architecture' },
        { label: 'Modules', href: '/docs/modules' },
      ]

    return (
        <div className="h-screen w-64 border border-right">
      <nav className="mt-5 px-5">
        <ul className="space-y-7">
            <li className="font-bold"><a href="/docs/introduction">Introduction</a></li>
            <ListDropdown title="Joyboy - Basics" items={items}/>
            <li><a href="/docs/resources">Resources</a></li>
        </ul>
      </nav>
    </div>
    );
  };
  
  export default Sidebar;
  