import "./App.css";
import SignatureForm from "./components/SignatureForm";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Joyboy Web App</h1>
        <p>Sign and Verify Messages with Nostr</p>
        <SignatureForm />
      </header>
    </div>
  );
}

export default App;
