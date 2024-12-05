import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => setError(`Failed to load post, ${err}`));
  }, [id, setPost]);

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      {post && (
        <div className="container mt-5">
          <h4>Title: {post.title}</h4>
          <p>Content: {post.content}</p>
          <button className="btn btn-danger" onClick={() => window.history.back()}>Back To Posts</button>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
