import React from 'react';

export function RetroLandingPage() {
  // Function to handle the click event
  const handleClick = () => {
    alert('Stay tuned, more coming soon.');
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 font-mono text-center">
      <h1 className="text-5xl font-bold text-yellow-400 mb-6">Welcome to Joyboy</h1>
      <p className="text-2xl mb-2">The treasure are friends we make along the way.</p>
      <p className="text-2xl mb-2">Freedom requires censorship resistance.</p>
      <button
        onClick={handleClick}
        className="mt-8 bg-red-700 hover:bg-red-800 font-bold py-2 px-4 rounded"
      >
        Joyn Us
      </button>
    </div>
  );
}
