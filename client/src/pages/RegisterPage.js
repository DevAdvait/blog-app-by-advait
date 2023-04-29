import { useState } from "react";
import "./signUp.css";

function RegisterPage() {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  async function register(ev){
    ev.preventDefault();
    const response = await fetch("https://badvait-backend.onrender.com/register",{
      method:"POST",
      body:JSON.stringify({username,password}),
      headers : {"Content-Type":"application/json"},
    })
    if(response.status === 200){
      alert("Registration Successfull ✔");
    } else { 
      alert("Registration Failed ❌");
    }
  }
  return (
    <div className="screen">
    <div className="screen__content">
      <form className="sign-up" onSubmit={register}>
        <h2 className="form-title" style={{ color: "#F6833B",fontSize:"3rem" }}>
          Register
        </h2>
        <div className="sign-up__field" >
          <i className="sign-up__icon fas fa-user" style={{ color: "#F6833B" }}></i>
          <input
            type="text"
            className="sign-up__input"
            placeholder="User name / Email"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
          />
        </div>
        <div className="sign-up__field" >
          <i className="sign-up__icon fas fa-lock" style={{ color: "#F6833B" }}></i>
          <input
            type="password"
            className="sign-up__input"
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </div>
        <button className="button sign-up__submit">
          <span className="button__text">Register Now</span>
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

export default RegisterPage;
