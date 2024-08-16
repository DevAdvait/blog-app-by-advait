import axios from "axios";
import { formatISO9075 } from "date-fns";
import { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

const PostImage = lazy(() => import("./PostImage"));

export default function Post({
  _id,
  title,
  summary,
  cover,
  createdAt,
  author,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSummary = () => {
    setIsExpanded(!isExpanded);
  };
  const getShortSummary = () => {
    const words = summary.split(" ");
    if (words.length <= 10) {
      return summary;
    }
    return words.slice(0, 10).join(" ") + " ";
  };

  return (
    <div className="post">
      <div className="post-image">
        <Link to={`/post/${_id}`}>
          <Suspense
            fallback={
              <div className="loading-image-shadow">
                <p>Loading image...</p>
              </div>
            }
          >
            <PostImage src={axios.defaults.baseURL + "/" + cover} alt={title} />
          </Suspense>
        </Link>
      </div>
      <div className="post-content">
        <Link to={`/post/${_id}`}>
          <h2 style={{ color: "#F6833B" }}>{title}</h2>
        </Link>
        <p className="info">
          <a
            href="https://www.advaittumbre.xyz"
            className="author"
            style={{ color: "#04e29d" }}
            target="_blank"
            rel="noreferrer"
          >
            {author.username}
          </a>
          <time style={{ color: "#ffffff" }}>
            {formatISO9075(new Date(createdAt))}
          </time>
        </p>

        <p className="summary" style={{ color: "#f8a774" }}>
          {isExpanded ? summary : getShortSummary()}
          {!isExpanded && summary.split(" ").length > 10 && (
            <button onClick={toggleSummary} className="hp-postSum-inLine-btn">
              <u>... Read More</u>
            </button>
          )}
        </p>
        {isExpanded && summary.split(" ").length > 10 && (
          <button onClick={toggleSummary} className="hp-postSum-btn">
            Show Less
          </button>
        )}
      </div>
    </div>
  );
}
