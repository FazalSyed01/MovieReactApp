import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newMovie, setNewMovie] = useState({ name: "", price: "", releaseDate: "", genreId: "" });
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://localhost:7002/api/movies", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else if (response.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("Network error");
      }
    };
    const fetchGenres = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://localhost:7002/api/genre", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          setGenres(result);
        } else if (response.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to fetch genres");
        }
      } catch (err) {
        setError("Network error");
      }
    };

    fetchData();
    fetchGenres();
  }, [navigate]);

  const deleteMovie = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      const response = await fetch(`https://localhost:7002/api/movies/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        // Remove the deleted movie from the state
        setData(data.filter((movie) => movie.id !== id));
      } else if (response.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to delete movie");
      }
    } catch {
      setError("Network error");
    }
  };

    const handleAddChange = (e) => {
    setNewMovie({ ...newMovie, [e.target.name]: e.target.value });
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://localhost:7002/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMovie),
      });
      if (response.ok) {
        const added = await response.json();
        setData([...data, added]);
        setShowAdd(false);
        setNewMovie({ name: "", price: "", releaseDate: "", genreId: "" });
      } else if (response.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to add movie");
      }
    } catch {
      setError("Network error");
    }
  };
  return (
    <div className="container mt-5">
      <h2>Home Page</h2>
      <p>Welcome to the home page!</p>
      <button className="btn btn-success mb-3" onClick={() => setShowAdd(true)}>
        Add Movie
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      {data === null ? (
        <div>Loading...</div>
      ) : (
        <div className="row">
          {data.map((movie) => (
            <div className="col-md-4 mb-4" key={movie.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{movie.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {movie.genre?.name}
                  </h6>
                  <p className="card-text">
                    <strong>Price:</strong> ${movie.price}
                    <br />
                    <strong>Release Date:</strong> {movie.releaseDate}
                  </p>
                  <button
                    className="btn btn-primary mr-1"
                    onClick={() => navigate(`/edit/${movie.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => deleteMovie(movie.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showAdd && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleAddMovie}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Movie</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAdd(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Name</label>
                    <input
                      name="name"
                      className="form-control"
                      value={newMovie.name}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Price</label>
                    <input
                      name="price"
                      type="number"
                      className="form-control"
                      value={newMovie.price}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Release Date</label>
                    <input
                      name="releaseDate"
                      type="date"
                      className="form-control"
                      value={newMovie.releaseDate}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Genre</label>
                    <select
                      name="genreId"
                      className="form-control"
                      value={newMovie.genreId}
                      onChange={handleAddChange}
                      required
                    >
                      <option value="">Select Genre</option>
                      {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Add more fields as needed */}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
