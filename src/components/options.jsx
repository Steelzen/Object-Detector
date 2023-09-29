import ToggleButton from "../common/toggleButton";
import Live from "./live";

const Options = ({ toggleStates, handleToggle }) => {
  return (
    <div className="bg-gray-900 text-white m-4 rounded-lg p-4">
      <div className="mr-10">
        <ul>
          <li className="flex justify-between items-center mb-2">
            <span>1. VIRTUAL FENCE</span>
            <ToggleButton
              id="vfBtn"
              className="virtual-fence-btn"
              isToggled={toggleStates.vfBtn}
              handleToggle={handleToggle}
            />
          </li>
          <li className="flex justify-between items-center mb-2">
            <span className="mr-4">2. PERSONAL PROTECTIVE EQUIPMENT</span>
            <ToggleButton
              id="ppeBtn"
              className="ppe-btn"
              isToggled={toggleStates.ppeBtn}
              handleToggle={handleToggle}
            />
          </li>
          <li className="flex justify-between items-center mb-2">
            <span>3. FACE RECOGNITION</span>
            <ToggleButton
              id="frBtn"
              className="face-recognition-btn"
              isToggled={toggleStates.frBtn}
              handleToggle={handleToggle}
            />
          </li>
          <li className="flex justify-between items-center mb-2">
            <span>4. PEOPLE COUNTING</span>
            <ToggleButton
              id="pcBtn"
              className="people-counting-btn"
              isToggled={toggleStates.pcBtn}
              handleToggle={handleToggle}
            />
          </li>
          <li className="flex justify-between items-center mb-2">
            <span>5. POSE ESTIMATION</span>
            <ToggleButton
              id="peBtn"
              className="pose-estimation-btn"
              isToggled={toggleStates.peBtn}
              handleToggle={handleToggle}
            />
          </li>
          <li className="flex justify-between items-center mb-2">
            <span>6. FALL DETECTION</span>
            <ToggleButton
              id="fdBtn"
              className="fall-detection-btn"
              isToggled={toggleStates.fdBtn}
              handleToggle={handleToggle}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Options;
