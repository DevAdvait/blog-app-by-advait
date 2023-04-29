import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch("https://badvait-backend.onrender.com/post/" + id).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      });
    });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    const response = await fetch("https://badvait-backend.onrender.com/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }

  return (
    <form onSubmit={updatePost} className="edit-post-form">
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        style={{
          marginBottom: "1rem",
          width: "100%",
          fontSize: "1rem",
          fontFamily: "Montserrat",
        }}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
        style={{
          marginBottom: "1rem",
          width: "100%",
          fontSize: "1rem",
          fontFamily: "Montserrat",
        }}
      />
      <input
        type="file"
        onChange={(ev) => setFiles(ev.target.files)}
        style={{
          marginBottom: "1rem",
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: "1rem",
          fontFamily: "Montserrat",
        }}
      />
      <Editor onChange={setContent} value={content} />
      <button
        style={{
          margin: "1rem auto",
          fontSize: "1.2rem",
        }}
        className="edit-post-submit-btn"
      >
        Update post
      </button>
    </form>
  );
}
