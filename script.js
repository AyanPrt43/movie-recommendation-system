const API_KEY = "bda6c32dc11d3141672aa55810fcbbc9";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("movies-container");
const searchInput = document.getElementById("search");
const genreSelect = document.getElementById("genre");
const toggle = document.getElementById("toggle");

const banner = document.getElementById("banner");
const bannerTitle = document.getElementById("banner-title");
const bannerDesc = document.getElementById("banner-desc");

// Load movies
fetchMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}`);

function fetchMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            showBanner(data.results[0]);
            showMovies(data.results);
        });
}

// 🎬 Banner Setup
function showBanner(movie) {
    banner.style.backgroundImage =
        `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

    bannerTitle.innerText = movie.title;
    bannerDesc.innerText = movie.overview.substring(0, 150) + "...";
}

// 🎥 Show Movies
function showMovies(movies) {
    moviesContainer.innerHTML = "";

    movies.forEach(movie => {
        const { title, poster_path, vote_average, id } = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        movieEl.innerHTML = `
            <img src="${IMG_URL + poster_path}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span>⭐ ${vote_average}</span>
                <button onclick="addToWatchlist('${title}')">❤️</button>
                <button onclick="getTrailer(${id})">▶ Trailer</button>
            </div>
        `;

        moviesContainer.appendChild(movieEl);
    });
}

// 🔍 Search
searchInput.addEventListener("keyup", (e) => {
    const q = e.target.value;

    if (q) {
        fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${q}`);
    } else {
        fetchMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}`);
    }
});

// 🎭 Genre
genreSelect.addEventListener("change", () => {
    const g = genreSelect.value;

    if (g) {
        fetchMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${g}`);
    } else {
        fetchMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}`);
    }
});

// 🌙 Toggle
toggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
});

// ❤️ Watchlist
function addToWatchlist(title) {
    let list = JSON.parse(localStorage.getItem("watchlist")) || [];

    if (!list.includes(title)) {
        list.push(title);
        localStorage.setItem("watchlist", JSON.stringify(list));
        alert("Added!");
    }
}

// 🎥 Trailer
function getTrailer(id) {
    fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            const trailer = data.results.find(v => v.type === "Trailer");

            if (trailer) {
                window.open(`https://youtube.com/watch?v=${trailer.key}`);
            }
        });
}