import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CreateBlog from "./CreateBlog";
import { Route, Routes, useNavigate } from "react-router-dom";
import PostDetails from "./PostDetails";
import { useLocation } from "react-router-dom";


function App() {
  const [posts, setPosts] = useState([]);
  const [numPosts, setNumPosts] = useState(5);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.alert) {
      const alertDiv = document.createElement("div");
      alertDiv.textContent = location.state.alert;
      alertDiv.style.color = "red";
      alertDiv.style.fontWeight = "bold";
      alertDiv.style.textAlign = "center";
      alertDiv.style.padding = "10px";
      alertDiv.style.backgroundColor = "#f8d7da";
      alertDiv.style.border = "1px solid #f5c6cb";
      alertDiv.style.borderRadius = "5px";
      alertDiv.style.marginBottom = "10px";

      document.body.appendChild(alertDiv);
      setNumPosts(numPosts + 1);
      setTimeout(() => {
        document.body.removeChild(alertDiv);
      }, 6000);
    }
  }, [location.state]);

  useEffect(() => {
    fetch(`http://localhost:3001/posts?_limit=${numPosts}`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => setError("Failed to load posts"));
  }, [numPosts]);


  const handleDelete = (id) => {
    fetch(`http://localhost:3001/posts/${id}`, { method: "DELETE" })
      .then(() => {
        setPosts(posts.filter((post) => post.id !== id));
        alert(`Post with id ${id} deleted`);
        fetch(`http://localhost:3001/posts?_limit=${numPosts}`)
          .then((res) => res.json())
          .then((data) => setPosts(data))
          .catch((err) => setError("Failed to reload posts"));
      })
      .catch((err) => setError("Failed to delete post"));
  };

  const handleShowDetails = (id) => {
    navigate(`/posts/${id}`);
  };

  return (
    <div className="container">
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">React Blog</span>
        <div>
          <button
            className="btn btn-success"
            onClick={() => navigate("/create")}
          >
            New Blog
          </button>
          <button className="btn btn-info" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Blog Posts</h1>
              <label>
                Number of posts to display:
                <input
                  type="number"
                  value={numPosts}
                  onChange={(e) => setNumPosts(e.target.value)}
                  min="1"
                />
              </label>

              {error ? (
                <p className="alert alert-danger">{error}</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td
                          style={{ cursor: "pointer" }}
                          onClick={() => handleShowDetails(post.id)}
                        >
                          {post.title}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleShowDetails(post.id)}
                          >
                            Show Details
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(post.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          }
        />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/posts/:id" element={<PostDetails />} />
      </Routes>
    </div>
  );
}

export default App;
