import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({
  _id,
  title,
  summary,
  cover,
  createdAt,
  author,
}) {
  return (
    <div className="post">
      <div className="post-image" style={{maxWidth:"250px",margin: "0 auto"}}>
        <Link to={`/post/${_id}`}>
          <img src={"https://badvait-backend.onrender.com/" + cover} alt={`${title}`} className="img-fluid"/>
        </Link>
      </div>
      <div className="post-content">
        <Link to={`/post/${_id}`}>
          <h2 style={{color:"#F6833B"}}>{title}</h2>
        </Link>
        <p className="info">
          <a href="https://www.advaittumbre.xyz" className="author" style={{color:"#04e29d"}} target="_blank" rel="noreferrer">
            {author.username}
          </a>
          <time style={{color:"#ffffff"}} >{formatISO9075(new Date(createdAt))}</time>
        </p>

        <p className="summary" style={{color:"#f8a774"}}>{summary}</p>
      </div>
    </div>
  );
}
