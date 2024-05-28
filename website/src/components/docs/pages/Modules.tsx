

const Modules: React.FC = () => {

    return (
        <>
        <div>
            <h2 className="font-bold text-3xl">Modules</h2>
            <div className="mt-5">
                <h4 className="font-bold text-lg">WEBAPP</h4>
                <p className="mt-3">The webapp is a simple frontend to sign and verify messages using a browser extension like Flamingo or nos2x. It is built using React and Tailwind CSS</p>
            </div>
            <div className="mt-5">
                <h4 className="font-bold text-lg">Development</h4>
                <p className="mt-3">To start the development server, run:</p>
                <p className="w-full text-white bg-gray-600 p-5 mt-3">npm start</p>
            </div>
             <div className="mt-5">
                <h4 className="font-bold text-lg">Build</h4>
                <p className="mt-3">To build project, Run;</p>
                <p className="w-full text-white bg-gray-600 p-5 mt-3">npm run build</p>
            </div>
             
            <div className="mt-5">
                <h4 className="font-bold text-lg">Build</h4>
                <p className="mt-3">To build project, Run;</p>
                <p className="w-full text-white bg-gray-600 p-5 mt-3">Scarb build</p>
            </div>
            <div className="mt-5">
                <h4 className="font-bold text-lg">Test</h4>
                <p className="mt-3">To start the development server, run:</p>
                <p className="w-full text-white bg-gray-600 p-5 mt-3">Snforge test</p>
            </div>
            <div className="mt-5">
                <h4 className="font-bold text-lg">MOBILE</h4>
                <p className="mt-3">The Joyboy Mobile app is built with React-native & Expo.</p>
<p className="mt-3">Pick an issue with the labels "mobile" to start work on React-native and contribute!</p>
            </div>
            <div className="mt-5">
                <h4 className="font-bold text-lg">Test</h4>
                <p className="mt-3">
To test the mobile app, run:</p>
                <p className="w-full text-white bg-gray-600 p-5 mt-3">cd JoyboyCommunity <br />npm i<br />
npm start</p>
<p className="mt-3">Select Expo web, Android or IOS. You can scan it with Expo GO on your phone.</p>
            </div>



        </div>
       
        </>
        
    );
  };
  
  export default Modules;
  