import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [error2, setError2] = useState(null);
  const [error3, setError3] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) setError2("Title is required");
    if (!content) setError3("Content is required");
    if (!title || !content) return;
    fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setError("Failed to create blog post");
          console.error("There was an error creating the blog post!");
        }
      })
      .then((data) => {
        if (data) {
          console.log("Blog post created:", data);
          setTitle("");
          setContent("");
          setError(null);
          navigate("/", {
            state: { alert: "Blog post created successfully!" },
          });
        }
      })
      .catch((error) => {
        setError("Failed to create blog post");
        console.error("There was an error creating the blog post!", error);
      });
  };

  return (
    <div className="container mt-5">
      <h2>Create a New Blog Post</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {error2 && <div className="alert alert-danger">{error2}</div>}
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            className="form-control"
            id="content"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          {error3 && <div className="alert alert-danger">{error3}</div>}
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
