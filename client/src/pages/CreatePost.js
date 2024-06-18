import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import axios from "axios";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append("title", title);
    data.append("summary", summary);
    data.append("content", content);
    if (files && files[0]) {
      data.append("file", files[0]);
    }

    try {
      const response = await axios.post("/post", data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setRedirect(true);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form
      onSubmit={createNewPost}
      className="create-post-form"
      style={styles.form}
    >
      <label htmlFor="title" style={styles.label}>
        Title
      </label>
      <input
        id="title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        style={styles.input}
      />
      <label htmlFor="summary" style={styles.label}>
        Summary
      </label>
      <input
        id="summary"
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
        style={styles.input}
      />
      <label htmlFor="file" style={styles.label}>
        Upload File
      </label>
      <input
        id="file"
        type="file"
        onChange={(ev) => setFiles(ev.target.files)}
        style={styles.fileInput}
      />
      <label htmlFor="content" style={styles.label}>
        Content
      </label>
      <Editor id="content" value={content} onChange={setContent} />
      <button style={styles.button} className="create-post-submit-btn">
        Create Post
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "-2px 2px 16px 5px rgba(14,198,204,0.65)",
    backgroundColor: "#7a6fdd",
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: "0.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    marginBottom: "1rem",
    width: "100%",
    fontSize: "1rem",
    fontFamily: "Montserrat",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    color: "#333",
  },
  fileInput: {
    marginBottom: "1rem",
  },
  button: {
    margin: "1rem auto",
    fontSize: "1.2rem",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "pointer",
  },
};
