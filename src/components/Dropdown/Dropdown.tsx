import React, { useState } from "react";
import "./dropdown.css";

const Dropdown: React.FC<{
  handleScaleSet: (newValue: string) => void;
  scale: number;
}> = ({ handleScaleSet, scale }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (value: string) => {
    handleScaleSet(value);
    setIsOpen(false);
  };
  const options: string[] = ["0.8", "1", "1.2"];
  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {`${Math.ceil(scale * 100)}%` || "Select an item"}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((el: string) => (
            <li onClick={() => handleItemClick(el)}>{Number(el) * 100}%</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
