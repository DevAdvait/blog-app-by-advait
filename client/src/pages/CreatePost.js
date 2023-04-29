import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    ev.preventDefault();
    const response = await fetch("https://badvait-backend.onrender.com/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form onSubmit={createNewPost} className="create-post-form">
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
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button
        style={{
          margin: "1rem auto",
          fontSize: "1.2rem",
        }}
        className="create-post-submit-btn"
      >
        Create Post
      </button>
    </form>
  );
}
