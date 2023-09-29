import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div className="bg-gray-900 text-white m-4 rounded-lg p-4">
      <div className="mr-10">
        <h1 className="text-lg">MENU</h1>
        <ul className="ml-3">
          <li className="m-2">
            <Link to="/live">LIVE MODE</Link>
          </li>
          <li className="m-2">
            <Link to="/offline">UPLOAD VIDEO </Link>
          </li>
          <li className="m-2">
            <Link to="/history">HISTORY</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
