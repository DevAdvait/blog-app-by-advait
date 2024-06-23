import { useEffect, useState } from "react";
import Post from "../Post";
import NewsletterSignUp from "../NewsletterSignUp";
import axios from "axios";
import LoadingPosts from "../components/LoadingPosts";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/post")
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="hp-posts-div" style={{ minHeight: "85vh" }}>
        {loading ? ( // Conditionally render loading text or posts
          // <div className="pp-loading">
          //   {"Loading...".split("").map((char, index) => (
          //     <span key={index}>{char}</span>
          //   ))}
          // </div>
          <LoadingPosts />
        ) : (
          posts.length > 0 &&
          posts.map((post) => <Post key={post._id} {...post} />)
        )}
      </div>
      <div>
        <NewsletterSignUp />
      </div>
    </div>
  );
}
