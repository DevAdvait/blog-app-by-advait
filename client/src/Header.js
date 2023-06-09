import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import Logo from "./Capture-removebg-preview.png";


export default function Header() {


  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("https://badvait-backend.onrender.com/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  });

  function Logout() {
    fetch("https://badvait-backend.onrender.com/logout", {
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
            <button onClick={Logout} className="logout-link btn"
            style={{background:"inherit", textAlign :"top", padding:"0",color:"#04e29d"}}>Logout ({username})</button>
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
