import React, { useState } from "react";

const SignatureForm: React.FC = () => {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const handleSign = async () => {
    if (!window.nostr) {
      alert("Nostr is not available in your browser.");
      return;
    }
    try {
      const pubkey = await window.nostr.getPublicKey();
      const signedEvent = await window.nostr.signEvent({
        created_at: Math.floor(Date.now() / 1000),
        kind: 1,
        tags: [],
        content: message,
      });
      setSignature(signedEvent.sig);
      setPublicKey(pubkey);
    } catch (error) {
      console.error("Error signing the message:", error);
      alert("Failed to sign the message.");
    }
  };

  const handleVerify = () => {
    // Simulate Starknet contract interaction
    alert("Signature verification failed.");
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Enter your message"
        className="input input-bordered w-full max-w-xs"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="btn btn-primary m-2" onClick={handleSign}>
        Sign Message
      </button>
      {signature && (
        <div>
          <p>Signature: {signature}</p>
          <p>Public Key: {publicKey}</p>
          <button className="btn btn-secondary" onClick={handleVerify}>
            Verify on Starknet
          </button>
        </div>
      )}
    </div>
  );
};

export default SignatureForm;
