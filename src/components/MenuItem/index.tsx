import { FiChevronRight } from "@react-icons/all-files/fi/FiChevronRight";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import MainContext from "../../contexts/questionnaire-context";
import "./styles.css";

type MenuItemProps = {
  id: string;
  icon: any;
  title: { value: string };
  items: { value: string; id: string; link?: string }[];
  activeItem?: string;
  onItemClick?: (id: string) => void;
  titleLink?: string;
};

export const MenuItem = ({
  id,
  icon,
  title,
  items,
  onItemClick,
  titleLink,
}: MenuItemProps) => {
  const { openedMenuItems, setOpenedMenuItems } = useContext(MainContext);
  const [open, setOpen] = useState(openedMenuItems?.[0]?.[id]);
  return (
    <>
      <Link to={titleLink || ""}>
        <header
          onClick={() => {
            setOpen(!open);
            setOpenedMenuItems?.([{ ...openedMenuItems?.[0], [id]: true }]);
          }}
          style={!open ? { opacity: 0.5 } : {}}
        >
          <>{icon}</>
          <span>{title.value}</span>
          <FiChevronRight size={20} className={open ? "rotate" : ""} />
        </header>
      </Link>
      <ul className={open ? "open" : "closed"}>
        {items.map((e, key) => (
          <Link
            key={e.value}
            to={e.link || ""}
            onClick={() => {
              setOpenedMenuItems?.([{ ...openedMenuItems?.[0] }, e.id]);
              onItemClick?.(e.id);
            }}
          >
            <li
              className={
                openedMenuItems?.[1] && openedMenuItems[1] === e.id
                  ? "active"
                  : ""
              }
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
