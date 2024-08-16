import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import Logo from "../assets/Logo.webp";
import axios from "axios";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage or wherever it's stored
        if (!token) {
          // No token available, handle accordingly
          setUserInfo(null);
          return;
        }
  
        const response = await axios.get("/profile", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request headers
          },
        });
  
        if (response.status === 200) {
          setUserInfo(response.data);
        } else {
          console.error("Failed to fetch profile:", response.status);
          setUserInfo(null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUserInfo(null);
      }
    };
  
    fetchProfile();
  }, [setUserInfo]);

  
  

  const Logout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
      setUserInfo(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        <div className="logo-div">
          <img src={Logo} alt="Blog App by Advait Tumbre Logo" className="img-fluid" />
        </div>
      </Link>

      <nav>
        {username && (
          <>
            <Link to="/create" className="create-link">
              Create New Post
            </Link>
            <button
              onClick={Logout}
              className="logout-link btn"
              style={{
                background: "inherit",
                textAlign: "top",
                padding: "0",
                color: "#04e29d",
              }}
            >
              Logout ({username})
            </button>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" className="login-link">
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
