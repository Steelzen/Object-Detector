import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Offline from "./components/offline";
import Live from "./components/live";
import History from "./components/history";
import Menu from "./components/menu";
import Options from "./components/options";
import Information from "./components/information";
import "./App.css";

function App() {
  const [toggleStates, setToggleStates] = useState({
    vfBtn: false,
    ppeBtn: true,
    odBtn: true,
    pcBtn: true,
    peBtn: false,
    fdBtn: false,
  });

  const handleToggle = (buttonId) => {
    setToggleStates((prevState) => ({
      ...prevState,
      [buttonId]: !prevState[buttonId],
    }));
  };

  return (
    <Router>
      <div className="flex w-full my-10 content-center mx-auto space-x-4 overflow-hidden overflow-x-scroll scrollbar-hide 2xl:justify-center">
        <div className="flex flex-nowrap flex-row shrink-0">
          <div className="flex flex-col shrink-0">
            <Menu />
            <Options toggleStates={toggleStates} handleToggle={handleToggle} />
            <div className="flex justify-center text-red-500">
              4, 5, 6 will be coming soon{" "}
            </div>
          </div>
          <div className="bg-gray-900 text-white w-640 h-480">
            <Routes>
              <Route
                path="/live"
                element={<Live toggleStates={toggleStates} />}
              />
              <Route
                path="/offline"
                element={<Offline toggleStates={toggleStates} />}
              />
              <Route path="/history" element={<History />} />
            </Routes>
          </div>
          <Information />
        </div>
      </div>
    </Router>
  );
}

export default App;
