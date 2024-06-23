import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import axios from "axios";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    axios.get(`/post/${id}`).then((response) => {
      const postInfo = response.data;
      setTitle(postInfo.title);
      setContent(postInfo.content);
      setSummary(postInfo.summary);
    });
  }, [id]);

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
    try {
      const response = await axios.put("/post", data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setRedirect(true);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
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
