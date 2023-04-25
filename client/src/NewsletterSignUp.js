import React, { useState } from "react";

const NewsletterSignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // validate name input
    if (!/^[a-zA-Z ]+$/.test(name)) {
      alert("Please enter a valid name");
      return;
    }

    // validate email input
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await response.json();
      console.log(data);

      // check if the email is already subscribed
      if (data.message === "already subscribed") {
        alert("You have already subscribed to the newsletter");
      } else {
        alert("Successfully subscribed to the newsletter");
      }
    } catch (error) {
      console.error(error);
      // Handle the error, such as displaying an error message
    }
  };

  return (
    <div className="news-letter-wrapper">
      <div className="news-letter-text">
        <h3>CodeBytes - Your Weekly Dose of Tech and Programming News</h3>
        <p>
          {" "}
          Stay up-to-date on the latest in tech and programming with CodeBytes!
          Get weekly updates on new technologies, programming tips and tricks,
          and industry news. Sign up now for free!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form newsLetter-signUp-form">
        <input
          type="text"
          className="name-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
        />

        <input
          type="email"
          className="email-input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
        />

        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
};

export default NewsletterSignUp;
