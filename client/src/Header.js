import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import Logo from "./Capture-removebg-preview.png";
export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  });

  function Logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        <div style={{ width: "180px", margin: "0", alignItems: "center" }}>
          <img
            src={Logo}
            alt="BADVAIT Logo"
            className="img-fluid"
    
          />
        </div>
      </Link>

      <nav>
   
        {username && (
          <>
            <Link to="/create" className="create-link">Create New Post</Link>
            <a onClick={Logout} className="logout-link">Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" className="login-link" >
              Login
            </Link>
            <Link to="/register" className="register-link">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
