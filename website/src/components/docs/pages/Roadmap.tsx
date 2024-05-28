

const Roadmap: React.FC = () => {

    return (
        <>
        <div>
            <h2 className="font-bold text-3xl">Roadmap</h2>
            <ol className="mt-5 list-decimal px-5 space-y-5">
                <li> Cairo implementation of Nostr signature verification</li>
<li> Starknet account contract implementation, controlled by Nostr keypair</li>
<li> Joyboy landing page</li>
<li> SocialPay feature to send and receive tips through Nostr signed messages</li>
<li> Implement a full Nostr client application with Starknet integration</li>
<li> Run Nostr relay server Crossover with Vault to bring Social features to the Vault application</li>
            </ol>
        </div>
       
        </>
        
    );
  };
  
  export default Roadmap;
  