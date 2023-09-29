import React from "react";

const Information = ({ toggleStates, peopleCount }) => {
  return (
    <div className="bg-gray-900 text-white m-4 rounded-lg p-4 w-350">
      <div>
        <h1 className="text-lg">INFORMATION</h1>
        {toggleStates.pcBtn && <div> Person Count: {peopleCount}</div>}
      </div>
    </div>
  );
};

export default Information;
