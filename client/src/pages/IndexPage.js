import { useEffect, useState } from "react";
import Post from "../Post";
import NewsletterSignUp from "../NewsletterSignUp";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("https://badvait-backend.onrender.com/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <div style={{ minHeight: "85vh" }}>
      {posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} />)}
      <NewsletterSignUp />
    </div>
  );
}
