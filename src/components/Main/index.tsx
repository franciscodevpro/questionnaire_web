import { BiDevices } from "@react-icons/all-files/bi/BiDevices";
import { FiSettings } from "@react-icons/all-files/fi/FiSettings";
import { FiUser } from "@react-icons/all-files/fi/FiUser";
import { PropsWithChildren, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { doLogout } from "../../api/signin/login";
import MainContext from "../../contexts/questionnaire-context";
import { routes_constraints, routes_helpers } from "../../util/route_utils";
import { MenuItem } from "../MenuItem";
import "./styles.css";

type MainProps = PropsWithChildren & { title: string };

export const Main = ({ children, title }: MainProps) => {
  const [active, setActive] = useState("1");
  const { questionnaires } = useContext(MainContext);
  return (
    <main className="main">
      <nav>
        <Link to={""}>
          <header>
            <img alt="Logo" src="/images/logo.png" />
          </header>
        </Link>
        <ul>
          <li>
            <MenuItem
              id={"1"}
              icon={<FiSettings size={20} />}
              title={{ value: "Questionários" }}
              items={questionnaires.map((elm) => ({
                value: elm.name,
                id: elm.id,
                link: routes_helpers.mountQuestionnaireId(elm.id),
              }))}
              activeItem={active}
              onItemClick={(id) => {
                setActive(id);
              }}
              titleLink={routes_constraints.QUESTIONNAIRE}
            />
          </li>
          <li>
            <MenuItem
              id={"2"}
              icon={<BiDevices size={20} />}
              title={{ value: "Aparelhos" }}
              items={[
                { value: "Tablet novo", id: "4" },
                { value: "Tablet antigo", id: "5" },
                { value: "Celular novo", id: "6" },
              ]}
              activeItem={active}
              onItemClick={(id) => setActive(id)}
            />
          </li>
          <li>
            <MenuItem
              id={"3"}
              icon={<FiUser size={20} />}
              title={{ value: "Entrevistadores" }}
              items={[
                { value: "Francisco Carlos", id: "7" },
                { value: "João Pedro", id: "8" },
                { value: "João Victor", id: "9" },
              ]}
              activeItem={active}
              onItemClick={(id) => setActive(id)}
            />
          </li>
        </ul>
        <details>
          <section>
            <button onClick={() => doLogout()}>Sair</button>
          </section>
          <summary className="footer">
            <span className="profile-icon"></span>
            <aside>
              <header>Francisco</header>
              <p>francisco.dev@dev.com</p>
            </aside>
          </summary>
        </details>
      </nav>
      <header>
        <p>{title}</p>
      </header>
      <main>{children}</main>
      <footer></footer>
    </main>
  );
};
