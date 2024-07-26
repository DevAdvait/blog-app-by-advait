import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../components/UserContext";
import { Link } from "react-router-dom";
import NewsletterSignUp from "../components/NewsletterSignUp";
import axios from "axios";
import LazyLoad from "react-lazyload";
import { Blurhash } from "react-blurhash";



export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    const cachedPost = localStorage.getItem(`post-${id}`);
    if (cachedPost) {
      setPostInfo(JSON.parse(cachedPost));
    } else {
      fetchPostData(id);
    }
  }, [id]);

  const fetchPostData = async (postId) => {
    try {
      const response = await axios.get(`/post/${postId}`);
      setPostInfo(response.data);
      localStorage.setItem(`post-${postId}`, JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to fetch post data:", error);
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem(`post-${id}`);
    fetchPostData(id);
  };

  if (!postInfo)
    return (
      <div className="pp-loading">
        {"Loading...".split("").map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </div>
    );

  const isAuthor =
    userInfo && postInfo.author && userInfo.id === postInfo.author._id;

  return (
    <div>
      <div className="post-page">
        <h1 style={{ color: "#F6833B" }}>{postInfo.title}</h1>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
        {postInfo.author && (
          <div className="author">by @{postInfo.author.username}</div>
        )}
        {isAuthor && (
          <div className="edit-row">
            <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit this post
            </Link>
          </div>
        )}
        <div className="image">
          <LazyLoad
            height={200}
            offset={100}
            placeholder={
              <Blurhash
                hash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
                width="100%"
                height="100%"
              />
            }
          >
            <img
              src={`${process.env.REACT_APP_BEP_LINK}/${postInfo.cover}`}
              alt={`${postInfo.title}`}
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </LazyLoad>
        </div>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: postInfo.content }}
        />
      </div>

      <button onClick={handleClearCache}>Clear Cache</button>

      <NewsletterSignUp />
    </div>
  );
}
