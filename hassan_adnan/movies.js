const baseUrl = "https://wibs.tech/restapi/adnan_backend.php";

async function fetchMovies() {
  try {
    const response = await fetch(baseUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

async function addMovie(movieData) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(movieData),
    });
  } catch (error) {
    console.error("Error adding movie:", error);
  }
}

async function updateMovie(movieId, movieData) {
  try {
    const response = await fetch(`${baseUrl}?id=${movieId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ ...movieData, id: movieId }),
    });
  } catch (error) {
    console.error("Error updating movie:", error);
  }
}

async function deleteMovie(movieId) {
  try {
    const response = await fetch(`${baseUrl}?id=${movieId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting movie:", error);
  }
}

function updateMovieList(movies) {
  const movieList = document.querySelector("#movie_list");
  movieList.innerHTML = "";

  movies.forEach((movie) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Title: ${movie.title}, 
                            Director: ${movie.director}, 
                            Year: ${movie.year}, 
                            Genre: ${movie.genre}, 
                            Views: ${movie.views}`;

    const editButton = createButton("Edit", () => handleEdit(movie.id));
    const deleteButton = createButton("Delete", async () => {
      await deleteMovie(movie.id);
      const updatedMovies = await fetchMovies();
      updateMovieList(updatedMovies);
    });

    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    movieList.appendChild(listItem);
  });
}

function createButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

function handleEdit(movieId) {
  fetch(`${baseUrl}?id=${movieId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((movieDetailsArray) => {
      const movieDetails = movieDetailsArray[0];

      if (movieDetails && movieDetails.title) {
        const editForm = document.createElement("form");
        editForm.innerHTML = `
                    <label for="edit_title">Title:</label>
                    <input type="text" 
                        id="edit_title" 
                        name="title" 
                        value="${movieDetails.title}" required>
                    <label for="edit_director">Director:</label>
                    <input type="text" 
                        id="edit_director"
                        name="director" 
                        value="${ movieDetails.director || ""}" required>
                    <label for="edit_year">Year:</label>
                    <input type="number" 
                        id="edit_year" 
                        name="year" 
                        value="${ movieDetails.year || ""}" required>
                    <label for="edit_genre">Genre:</label>
                    <input type="text" 
                        id="edit_genre" 
                        name="genre" 
                        value="${movieDetails.genre || ""}" required>
                    <label for="edit_views">Views:</label>
                    <input type="number" 
                    id="edit_views" 
                    name="views" 
                    value="${movieDetails.views || ""}" required>
                    <button type="submit">Save Changes</button>
                `;

        editForm.addEventListener("submit", async (event) => {
          event.preventDefault();

          const updatedMovieData = {
            title: editForm.elements.edit_title.value,
            director: editForm.elements.edit_director.value,
            year: editForm.elements.edit_year.value,
            genre: editForm.elements.edit_genre.value,
            views: editForm.elements.edit_views.value,
          };

          await updateMovie(movieId, updatedMovieData);

          const updatedMovies = await fetchMovies();

          updateMovieList(updatedMovies);

          editForm.remove();
        });

        document.body.appendChild(editForm);
      } else {
        console.error("Error: Movie details not available or incomplete");
      }
    })
    .catch((error) =>
      console.error("Error fetching movie details for editing:", error)
    );
}

document.addEventListener("DOMContentLoaded", async () => {
  const addMovieForm = document.querySelector("#movie_form");
  const response = await fetchMovies();

  if (response) {
    updateMovieList(response);
  }

  addMovieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(addMovieForm);
    const movieData = Object.fromEntries(formData.entries());

    await addMovie(movieData);
    addMovieForm.reset();

    const updatedMovies = await fetchMovies();
    updateMovieList(updatedMovies);
  });
});
