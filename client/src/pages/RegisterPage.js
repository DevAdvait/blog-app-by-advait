import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./signUp.css";

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Formik useFormik hook for form management
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username or Email is required")
        .matches(/^\S*$/, "Username cannot contain spaces")
        .max(25, "Username or Email must be less than 25 characters")
        .test(
          "no-special-characters",
          "Username cannot contain special characters",
          (value) => /^[a-zA-Z0-9]*$/.test(value)
        ),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          'Password must contain at least one special character : !@#$%^&*(),.?":{}|<>'
        )
        .test(
          "no-sql-injection",
          "Password cannot contain SQL injection characters",
          (value) => {
            const sqlRegex = /[;'"`]/; // Add more SQL injection characters if needed
            return !sqlRegex.test(value);
          }
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        const response = await axios.post("/register", values, {
          headers: { "Content-type": "application/json" },
        });

        if (response.status === 201) {
          alert("Registration Successful ✔");
          navigate("../login");
        } else {
          alert(
            `Registration Failed ❌: ${response.data.error || "Unknown error"}`
          );
        }
      } catch (error) {
        console.error("Registration Error:", error);
        alert("An error occurred during registration. Please try again later.");
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="screen">
      <div className="screen__content">
        <form className="sign-up" onSubmit={formik.handleSubmit}>
          <h2
            className="form-title"
            style={{ color: "#F6833B", fontSize: "3rem" }}
          >
            Register
          </h2>
          <div className="sign-up__field">
            <i
              className="sign-up__icon fas fa-user"
              style={{ color: "#F6833B" }}
            ></i>
            <input
              type="text"
              id="username"
              name="username"
              className="sign-up__input"
              placeholder="Username or Email"
              autoComplete="username"
              required
              {...formik.getFieldProps("username")}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="error-message">{formik.errors.username}</div>
            ) : null}
          </div>
          <div className="sign-up__field">
            <i
              className="sign-up__icon fas fa-lock"
              style={{ color: "#F6833B" }}
            ></i>
            <input
              type="password"
              id="password"
              name="password"
              className="sign-up__input"
              placeholder="Password"
              autoComplete="new-password"
              required
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error-message">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="sign-up__field">
            <i
              className="sign-up__icon fas fa-lock"
              style={{ color: "#F6833B" }}
            ></i>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="sign-up__input"
              placeholder="Confirm Password"
              autoComplete="new-password"
              required
              {...formik.getFieldProps("confirmPassword")}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="error-message">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            className="button sign-up__submit"
            disabled={formik.isSubmitting}
          >
            {loading ? (
              "Registering..."
            ) : (
              <span className="button__text">Register Now</span>
            )}
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
