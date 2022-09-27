import { Link } from "react-router-dom";
import { FiSettings } from "@react-icons/all-files/fi/FiSettings";
import { FiUser } from "@react-icons/all-files/fi/FiUser";
import { FiChevronRight } from "@react-icons/all-files/fi/FiChevronRight";
import { BiDevices } from "@react-icons/all-files/bi/BiDevices";
import "./styles.css";
import { MenuItem } from "../MenuItem";

type MainProps = {};

export const Main = ({}: MainProps) => {
  return (
    <main className="main">
      <nav>
        <Link to={""}>
          <header>
            <img alt="Logo" src="images/logo.png" />
          </header>
        </Link>
        <ul>
          <li>
            <MenuItem
              icon={<FiSettings size={20} />}
              title={{ value: "Questionários" }}
              items={[{ value: "Eleições para senador de felicidade" }]}
            />
          </li>
          <li>
            <MenuItem
              icon={<BiDevices size={20} />}
              title={{ value: "Aparelhos" }}
              items={[{ value: "Tablet novo" }]}
            />
          </li>
          <li>
            <MenuItem
              icon={<FiUser size={20} />}
              title={{ value: "Entrevistadores" }}
              items={[{ value: "Francisco Carlos" }]}
            />
          </li>
        </ul>
        <footer>
          <span></span>
          <aside>
            <header>Francisco</header>
            <p>francisco.dev@dev.com</p>
          </aside>
        </footer>
      </nav>
      <header>Questionáros</header>
      <main>
        <h1>Todos ativos</h1>
      </main>
      <footer></footer>
    </main>
  );
};
