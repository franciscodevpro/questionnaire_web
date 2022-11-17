import { useState } from "react";
import "./styles.css";

type PopUpProps = {
  children: JSX.Element;
  onClose?: () => void;
};

export const PopUp = ({ children, onClose }: PopUpProps) => {
  const [hidden, setHidden] = useState(false);
  const handleClick = () => {
    setHidden(true);
  };
  return (
    <div className={`popup-container${hidden ? " hidden" : ""}`}>
      <div
        className="popup-background"
        onClick={() => {
          onClose?.() || handleClick();
        }}
      ></div>
      {children}
    </div>
  );
};
