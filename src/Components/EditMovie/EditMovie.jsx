import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `https://localhost:7002/api/movies/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setMovie(result);
        } else if (response.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to fetch movie data");
        }
      } catch {
        setError("Network error");
      }
    };
    fetchMovie();
  }, [id, navigate]);

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://localhost:7002/api/movies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movie),
      });
      if (response.ok) {
        navigate("/");
      } else if (response.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to update movie");
      }
    } catch {
      setError("Network error");
    }
  };
    if (!movie) return <div>Loading...</div>;

    return (
    <div className="container mt-5">
      <h2>Edit Movie</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            name="name"
            className="form-control"
            value={movie.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Price</label>
          <input
            name="price"
            type="number"
            className="form-control"
            value={movie.price || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Release Date</label>
          <input
            name="releaseDate"
            type="date"
            className="form-control"
            value={movie.releaseDate ? movie.releaseDate.substring(0, 10) : ""}
            onChange={handleChange}
            required
          />
        </div>
        {/* Add more fields as needed */}
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}
export default EditMovie;