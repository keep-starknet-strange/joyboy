import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "./Sidebar";
import Footer from "../Footer";
import { useEffect, useState } from "react";

const DocsLayout: React.FC = () => {
  const [left, setLeft] = useState<string | null>(null);
  const [right, setRight] = useState<string | null>(null);

  const sidebarElements = ["introduction", "roadmap", "architecture", "modules", "resources"];

  const getDirections = (url: string) => {
    const regex = /(?<=\/docs\/).*/;
    const match = url.match(regex);

    if (!match) {
      return { left: null, right: null };
    }

    const matchedElement = match[0];
    const index = sidebarElements.indexOf(matchedElement);

    if (index === -1) {
      return { left: null, right: null };
    }

    const leftValue = index > 0 ? sidebarElements[index - 1] : null;
    const rightValue = index < sidebarElements.length - 1 ? sidebarElements[index + 1] : null;

    return { left: leftValue, right: rightValue };
  };

  useEffect(() => {
    const url = window.location.href;
    const { left: leftValue, right: rightValue } = getDirections(url);
    setLeft(leftValue);
    setRight(rightValue);
  }, []);

  useEffect(() => {
    console.log("Left:", left);
    console.log("Right:", right);
  }, [left, right]);

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-10">
          <Outlet />
          <div className="m-5 flex justify-between">
        <div className="justify-self-start">
          {left && <DirectionButton link={`/docs/${left}`} title="Previous" current={left}/>}

        </div>
        <div className="justify-self-end">
          {right && <DirectionButton link={`/docs/${right}`} title="Next" current={right}/>}
        </div>
      </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

interface DropdownProps {
  title: string;
  current: string;
  link: string;
}

const DirectionButton: React.FC<DropdownProps> = ({ title, current, link }) => {
  return (
    <div className="w-96 py-7 px-6 border rounded-xl">
      <a href={link}>
        <div className="text-right">
          <p className="font-extralight text-sm mb-2">{title}</p>
          <p className="text-blue-400 font-bold capitalize text-lg">{current}</p>
        </div>
      </a>
    </div>
  );
};

export default DocsLayout;
