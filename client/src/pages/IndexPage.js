import { useEffect, useState } from "react";
import Post from "../Post";
import NewsletterSignUp from "../NewsletterSignUp";
import axios from "axios";
import LoadingPosts from "../components/LoadingPosts";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/post?page=${page}`);
        setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
        setHasMore(response.data.hasMore);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const loadMorePosts = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div>
      <div className="hp-posts-div" style={{ minHeight: "85vh" }}>
        {loading && page === 1 ? (
          <LoadingPosts />
        ) : (
          posts.length > 0 &&
          posts.map(post => <Post key={post._id} {...post} />)
        )}
      </div>
      {hasMore && !loading && (
        <button onClick={loadMorePosts}>Load More</button>
      )}
      <div>
        <NewsletterSignUp />
      </div>
    </div>
  );
}
