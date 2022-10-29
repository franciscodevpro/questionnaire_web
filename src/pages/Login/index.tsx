import { useState } from "react";
import { Navigate } from "react-router-dom";
import { doLogin } from "../../api/signin/login";
import "./styles.css";

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="Login">
      <img className="logo" alt="Logo" src="/images/logo.png" />
      <form className="login-form">
        <p>
          <label>Login:</label>
          <input type="text" onChange={(e) => setLogin(e.target.value)} />
        </p>
        <p>
          <label>Senha:</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </p>
        <button
          type="button"
          onClick={async () => {
            await doLogin({ login, password });
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
