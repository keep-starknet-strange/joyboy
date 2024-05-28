import architectureImage from "../../../architecture.png"

const Architecture: React.FC = () => {

    return (
        <>
        <div>
            <h2 className="font-bold text-3xl">Architecture</h2>
            <h3 className="text-xl mt-7">Joyboy Social architecture</h3>
            <ul className="mt-3 list-disc px-7">
        <li> Alice sends tokens to Bob </li>
            </ul>
            
            <div className="p-5">
                <img src={architectureImage} alt="architecture" />

            </div>
        </div>
       
        </>
        
    );
  };
  
  export default Architecture;
  