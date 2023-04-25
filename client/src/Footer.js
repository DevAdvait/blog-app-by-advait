import React from "react";
import NewsletterSignUp from "./NewsletterSignUp";

const Footer = () => {
  return (
    <footer>
      {/* other footer content */}
      <NewsletterSignUp />
      <div
        class="text-center p-3"
        style={{
          backgroundColor: "inherit",
          display: "flex",
          justifyContent: "center",
          columnGap: "10px",
          marginTop: "1rem",
        }}
      >
        © 2020 Copyright :
        <a
          class="text-white"
          href="advaittumbre.xyz"
          style={{
            textDecoration: "none",
            fontWeight: "600",
            background:
              " linear-gradient(to right, var(--blue) 10%, var(--orange) 60%)",
            webkitBackgroundClip: "text",
            webkitTextFillColor: "transparent",
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
