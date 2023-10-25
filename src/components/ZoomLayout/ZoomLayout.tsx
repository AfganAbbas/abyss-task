import React, { useState } from "react";
import "./zoom-layout.css";
import Dropdown from "../Dropdown/Dropdown";
import CenterLogo from "../../assets/icons/center.svg";

const ZoomPanContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleZoomIn = () => {
    setScale((prevState) => prevState + 0.2);
  };

  const handleZoomOut = () => {
    setScale((prevState) => prevState - 0.2);
  };

  const handleScaleSet = (newValue: string) => {
    setScale(Number(newValue));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setStartX(e.clientX - translateX);
    setStartY(e.clientY - translateY);
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      setTranslateX(deltaX);
      setTranslateY(deltaY);
    }
  };

  const handleReset = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  const containerStyle: React.CSSProperties = {
    transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
    transformOrigin: "0 0",
    transition: "transform 0.25s",
    position: "relative",
    userSelect: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    zIndex: "1",
  };

  return (
    <div>
      <div className="navbar">
        <button className="navbar__item" onClick={handleReset}>
          <img src={CenterLogo} alt="center" />
        </button>
        <div className="navbar__wraper">
          <button className="navbar__item positive" onClick={handleZoomOut}>
            -
          </button>
          <Dropdown handleScaleSet={handleScaleSet} scale={scale} />
          <button className="navbar__item negative" onClick={handleZoomIn}>
            +
          </button>
        </div>
      </div>
      <div
        style={containerStyle}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {children}
      </div>
    </div>
  );
};

export default ZoomPanContainer;
