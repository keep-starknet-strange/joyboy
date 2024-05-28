import "./App.css";
import Main from "./Main";

import DocsLayout from "./components/docs/DocsLayout";

import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Introduction from "./components/docs/pages/Introduction";
import Roadmap from "./components/docs/pages/Roadmap";
import Architecture from "./components/docs/pages/Architecture";
import Modules from "./components/docs/pages/Modules";
import Resources from "./components/docs/pages/Resources";
import AboutUs from "./components/AboutUs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/about" element={<AboutUs />} />
      <Route path="/docs" element={<DocsLayout />}>
      <Route index element={<Navigate replace to="introduction" />} />
      <Route path="introduction" element={<Introduction />} />
      <Route path="roadmap" element={<Roadmap />} />
      <Route path="architecture" element={<Architecture />} />
      <Route path="modules" element={<Modules />} />
      <Route path="resources" element={<Resources />} />
      </Route>
      </Routes>
      
    
    </Router>
  );
}

export default App;
