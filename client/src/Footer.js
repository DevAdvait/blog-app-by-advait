import React from "react";
import NewsletterSignUp from "./NewsletterSignUp";

const Footer = () => {
  return (
    <footer>
      {/* other footer content */}
      <NewsletterSignUp />
      <div
        className="text-center p-3"
        style={{
          backgroundColor: "inherit",
          display: "flex",
          justifyContent: "center",
          columnGap: "10px",
          marginTop: "1rem",
        }}
      >
        © 2023 Copyright :
        <a
          className="text-white"
          href="https://www.advaittumbre.xyz"
          target={"_blank"}
          rel="noreferrer"
          style={{
            textDecoration: "none",
            fontWeight: "600",
            background:
              " linear-gradient(to right, var(--blue) 10%, var(--orange) 60%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Advait Tumbre
        </a>
      </div>
    </footer>
  );
};

export default Footer;
