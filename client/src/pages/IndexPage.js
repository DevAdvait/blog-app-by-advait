import { useEffect, useState, Suspense } from "react";
import Post from "../components/Post";
import NewsletterSignUp from "../components/NewsletterSignUp";
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
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
        setHasMore(response.data.hasMore);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const loadMorePosts = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div>
      <div className="hp-posts-div">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Suspense
              key={post._id}
              fallback={<LoadingPosts />} // Fallback while loading posts
            >
              <Post {...post} />
            </Suspense>
          ))
        ) : (
          <LoadingPosts /> // Initial loading state
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
