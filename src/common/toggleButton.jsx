import React, { useState } from "react";

function ToggleButton({ id, isToggled, handleToggle }) {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="hidden"
        checked={isToggled}
        onChange={() => handleToggle(id)}
      />
      <div className="relative">
        <div
          className={`block w-10 h-6 rounded-full ${
            isToggled ? "bg-green-400" : "bg-gray-400"
          } transition-colors duration-300`}
        ></div>
        <div
          className={`absolute block w-4 h-4 mt-1 bg-white rounded-full shadow inset-y-0 ${
            isToggled ? "left-6" : "left-1"
          } transition-transform duration-300`}
        ></div>
      </div>
    </label>
  );
}

export default ToggleButton;
