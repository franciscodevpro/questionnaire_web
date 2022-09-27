import React from "react";
import "./styles.css";

function Login() {
  return (
    <div className="Login">
      <img className="logo" alt="Logo" src="images/logo.png" />
      <form className="login-form">
        <p>
          <label>Login:</label>
          <input type="text" />
        </p>
        <p>
          <label>Senha:</label>
          <input type="password" />
        </p>
        <button type="button">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
