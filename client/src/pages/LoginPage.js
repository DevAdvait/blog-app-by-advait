import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Navigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import axios from "axios";
import "./loginPage.css";

function LoginPage() {
  const { setUserInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  // Formik useFormik hook for form management
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username or Email is required")
        .max(50, "Username or Email must be less than 50 characters"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await axios.post("/login", values, {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        });

        if (response.status === 200) {
          setUserInfo(response.data);
          setSubmitting(false);
          setRedirect(true);
        }
      } catch (error) {
        setFieldError("general", "Wrong credentials. Please try again.");
        setSubmitting(false);
      }
    },
  });

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="screen">
      <div className="screen__content">
        <form className="login" onSubmit={formik.handleSubmit}>
          <h2
            className="form-title"
            style={{ color: "#F6833B", fontSize: "3rem" }}
          >
            Login
          </h2>
          <div className="login__field">
            <i
              className="login__icon fas fa-user"
              style={{ color: "#F6833B" }}
            ></i>
            <input
              type="text"
              id="username"
              name="username"
              className="login__input"
              placeholder="Username or Email"
              autoComplete="username"
              required
              {...formik.getFieldProps("username")}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="error-message">{formik.errors.username}</div>
            ) : null}
          </div>
          <div className="login__field">
            <i
              className="login__icon fas fa-lock"
              style={{ color: "#F6833B" }}
            ></i>
            <input
              type="password"
              id="password"
              name="password"
              className="login__input"
              placeholder="Password"
              autoComplete="current-password"
              required
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error-message">{formik.errors.password}</div>
            ) : null}
          </div>
          {formik.errors.general && (
            <div className="error-message">{formik.errors.general}</div>
          )}
          <button
            type="submit"
            className="button login__submit"
            disabled={formik.isSubmitting}
          >
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
