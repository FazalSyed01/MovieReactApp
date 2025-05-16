import React, { use, useEffect, useState } from "react";

function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://localhost:7002/movies", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('Network error');
      }
    };

        fetchData();
  });

  return (
      <div className="container mt-5">
      <h2>Home Page</h2>
      <p>Welcome to the home page!</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {data.map((movie) => (
          <div className="col-md-4 mb-4" key={movie.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{movie.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{movie.genre?.name}</h6>
                <p className="card-text">
                  <strong>Price:</strong> ${movie.price}<br />
                  <strong>Release Date:</strong> {movie.releaseDate}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
