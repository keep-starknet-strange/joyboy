import {motion} from 'framer-motion';

import {Footer} from './Footer';
import {Navbar} from './Navbar';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <div className="desktop:h-[900px] h-[833px] w-full overflow-hidden relative pt-[98px] desktop:pt-[159px] flex justify-center bg-black desktop:bg-herobg bg-mobileHeroBg bg-no-repeat bg-bottom">
        <motion.img
          animate={{x: [500, 0]}}
          transition={{
            x: {duration: 1},
          }}
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          src="/assets/moon.svg"
          className="absolute top-5 desktop:top-[36px] right-[31px] desktop:right-[150px] w-[50px] desktop:w-auto"
          alt=""
        />
        <motion.div
          animate={{y: [1200, 0]}}
          transition={{
            y: {duration: 1},
          }}
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          className="desktop:w-[50%] w-[100%] flex flex-col items-center text-white h-fit relative z-[270] ml-auto px-24"
        >
          <h1 className="desktop:text-5xl text-[36px] desktop:leading-[70px] mb-3 justify-self-end">
            Building for the Community, by the Community
          </h1>
          <p className="desktop:text-[16px] text-base leading-8 mb-8">
            Welcome to Joyboy, a decentralized social media platform where your voice matters.
            Entirely open-sourced and community-managed, Joyboy empowers you to shape your social
            media experience
          </p>
        </motion.div>
        <motion.img
          src="/assets/joyboyMascot.png"
          className="absolute left-[292px] desktop:left-492 bottom-[10px] desktop:bottom-[200px] z-[250] desktop:w-[380px] w-[210px]"
          alt=""
          animate={{x: [-500, 0]}}
          transition={{
            x: {duration: 1},
          }}
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
        />
      </div>
      <div className="mx-24 mt-12">
        <div className="mt-12 p-8">
          <h1 className="text-5xl text-center">About Us</h1>
          <p className="p-5 tracking-wide leading-loose">
            Welcome to Joyboy, the decentralized social media platform built with Nostr and powered
            by Starknet account abstraction. Joyboy aims to revolutionize social networking by
            blending SocialFi (social finance) with cutting-edge blockchain technology, bridging the
            gap between Web2 networks and decentralized finance (DeFi). This integration allows
            users to earn rewards for their engagement while maintaining control over their data and
            freedom of expression.
          </p>
        </div>
        <div className="mt-12 p-8">
          <h1 className="text-5xl p-5">Why Nostr</h1>
          <p className="p-5 tracking-wide leading-loose">
            Nostr, short for &quot;Notes and Other Stuff Transmitted by Relays,&quot; is a simple
            yet powerful protocol enabling secure and censorship-resistant communication. Here’s a
            brief guide to understanding Nostr:
            <ol className="list-decimal p-4">
              <li>
                Decentralized Network: No central authority controls Nostr, ensuring true
                decentralization.
              </li>
              <li>
                Pseudonymous Accounts: No need for an email or phone number to create an account.
              </li>
              <li>Monetization: Creators can earn tips directly from their content.</li>
              <li>Open Source: Anyone can contribute to the development of Nostr.</li>
            </ol>
          </p>
        </div>
        <div className="mt-12 p-8">
          <h1 className="text-5xl p-5">How does Nostr work ?</h1>
          <p className="p-5 tracking-wide leading-loose">
            Nostr operates by allowing users to publish and query notes through independent servers
            (relays), eliminating single points of failure and enhancing both privacy and
            reliability. This decentralized approach addresses the censorship issues faced by
            traditional social media platforms, offering a haven for controversial speech without
            the risk of deplatforming. Nostr’s innovative approach to identity and user experience
            allows individuals to view feeds from any public key, offering diverse perspectives and
            a unique glimpse into other users’ thoughts and
          </p>
        </div>
        <div className="mt-12 p-24 border border-blue-400 rounded-3xl bg-blue-600 bg-opacity-10 backdrop-filter backdrop-blur-lg text-white">
          <h1 className="text-5xl text-center font-bold text-blue-500">What is Joyboy?</h1>
          <p className="p-5 tracking-wide leading-loose">
            Joyboy is a decentralized SocialFi platform that combines the Nostr protocol with
            Starknet’s native account abstraction. Nostr, often referred to as the
            &quot;Farcaster&quot; of Bitcoin, emphasizes censorship resistance and is minimalistic
            and pure in design. Utilizing Bitcoin cryptographic primitives such as Schnorr
            signatures and concepts like NIP-13 Proof of Work as an anti-spam mechanism, Nostr is
            integrated into various Lightning wallets like @getAlby, Wallet of Satoshi and Blue
            wallet Leveraging the power of Starknet’s Account Abstraction, Joyboy enables users to
            control their Starknet accounts with their Nostr keypair. This integration allows us to
            build advanced features like fully trustless Social Pay and intent-based actions driven
            by messages on the social app. We can even explore Al-driven intent-based systems with
            trustless on-chain verification using ZKML provided by Giza Tech and Herodotus
          </p>
        </div>
        <div className="mt-12 p-8">
          <h1 className="text-5xl px-5">Understanding SocialFi</h1>
          <p className="p-5 tracking-wide leading-loose">
            SocialFi is the fusion of social media and decentralized finance, empowering users
            <ol className="list-disc p-4">
              <li>Data Control: Users have complete ownership of their data.</li>
              <li>Freedom of Expression: Censorship resistance ensures free speech.</li>
              <li>
                Earning Opportunities: Users can earn rewards for their engagement through various
                monetization strategies.
              </li>
            </ol>
          </p>
        </div>
        <div className="mt-2 px-8">
          <h1 className="text-5xl px-5">Key Elements Include</h1>
          <p className="p-5 tracking-wide leading-loose">
            <ol className="list-disc p-4">
              <li>
                Digital Ownership with NFTs: Non-fungible tokens (NFTs) ensure secure and verifiable
                digital ownership.
              </li>
              <li>
                Decentralized Governance with DAOs: Decentralized autonomous organizations (DAOs)
                facilitate community-driven decision-making.
              </li>
            </ol>
          </p>
        </div>
        <div className="mt-2 px-8">
          <h1 className="text-5xl px-5">Building Blocks of SocialFi</h1>
          <p className="p-5 tracking-wide leading-loose">
            SocialFi relies on several core components:
            <ol className="list-disc p-4">
              <li>
                Monetization through Social Tokens: Creators can earn directly from their content.
              </li>
              <li>Censorship Resistance: Decentralized curation ensures freedom of speech.</li>
              <li>Digital Ownership: NFTs provide secure ownership of digital assets.</li>
            </ol>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
