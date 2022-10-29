import { FiChevronRight } from "@react-icons/all-files/fi/FiChevronRight";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

type MenuItemProps = {
  icon: any;
  title: { value: string };
  items: { value: string; id: string }[];
  activeItem?: string;
  onItemClick?: (id: string) => void;
};

export const MenuItem = ({
  icon,
  title,
  items,
  activeItem,
  onItemClick,
}: MenuItemProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Link to={""}>
        <header
          onClick={() => setOpen(!open)}
          style={!open ? { opacity: 0.5 } : {}}
        >
          <>{icon}</>
          <span>{title.value}</span>
          <FiChevronRight size={20} className={open ? "rotate" : ""} />
        </header>
      </Link>
      <ul className={open ? "open" : "closed"}>
        {items.map((e, key) => (
          <Link key={e.value} to={""} onClick={() => onItemClick?.(e.id)}>
            <li
              className={activeItem && activeItem === e.id ? "active" : ""}
              title={e.value}
            >
              {e.value}
            </li>
          </Link>
        ))}
      </ul>
    </>
  );
};