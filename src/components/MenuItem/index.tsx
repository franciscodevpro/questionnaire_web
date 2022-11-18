import { FiChevronRight } from "@react-icons/all-files/fi/FiChevronRight";
import { useContext } from "react";
import { Link } from "react-router-dom";
import MainContext from "../../contexts/questionnaire-context";
import "./styles.css";

type MenuItemProps = {
  id: string;
  icon: any;
  title: { value: string };
  items: { value: string; id: string; link?: string }[];
  titleLink?: string;
};

export const MenuItem = ({
  id,
  icon,
  title,
  items,
  titleLink,
}: MenuItemProps) => {
  const { openedMenuItems, setOpenedMenuItems } = useContext(MainContext);
  return (
    <>
      <header
        onClick={() => {
          setOpenedMenuItems?.([
            { ...openedMenuItems?.[0], [id]: !openedMenuItems?.[0][id] },
          ]);
        }}
        style={!open ? { opacity: 0.5 } : {}}
      >
        <Link className="icon" to={titleLink || ""}>
          {icon}
        </Link>
        <Link className="span" to={titleLink || ""}>
          {title.value}
        </Link>
        <FiChevronRight
          size={20}
          className={openedMenuItems?.[0]?.[id] ? "rotate" : ""}
        />
      </header>
      <ul className={openedMenuItems?.[0]?.[id] ? "open" : "closed"}>
        {items.map((e, key) => (
          <Link
            key={e.value}
            to={e.link || ""}
            onClick={() => {
              setOpenedMenuItems?.([{ ...openedMenuItems?.[0] }, e.id]);
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
