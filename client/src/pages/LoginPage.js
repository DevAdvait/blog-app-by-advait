import { useContext, useState } from "react";
import "./loginPage.css";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    const response = await fetch("https://badvait-backend.onrender.com/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("Wrong Credentials");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="screen">
      <div className="screen__content">
        <form className="login" onSubmit={login}>
          <h2 className="form-title" style={{ color: "#F6833B",fontSize:"3rem"  }}>
            Login
          </h2>
          <div className="login__field" >
            <i className="login__icon fas fa-user" style={{ color: "#F6833B" }}></i>
            <input
              type="text"
              className="login__input"
              placeholder="User name / Email"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
            />
          </div>
          <div className="login__field" >
            <i className="login__icon fas fa-lock" style={{ color: "#F6833B" }}></i>
            <input
              type="password"
              className="login__input"
              placeholder="Password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>
          <button className="button login__submit">
            <span className="button__text">Log In Now</span>
            <i className="button__icon fas fa-chevron-right"></i>
          </button>
        </form>
      </div>
      <div className="screen__background">
        <span className="screen__background__shape screen__background__shape4"></span>
        <span className="screen__background__shape screen__background__shape3"></span>
        <span className="screen__background__shape screen__background__shape2"></span>
        <span className="screen__background__shape screen__background__shape1"></span>
      </div>
    </div>
  );
}

export default LoginPage;
