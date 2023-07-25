"use strict";
console.log(`hello from movie-project-main.js`);

const DOMAIN = 'http://localhost:3000';
// fire up json server: json-server --watch data/db.json

// Fetch & .then



// commented out are the original versions
// GETTER
// Get Movies by Search function:
// function getMoviesBySearch (queryParam) {
//     const baseUrl = 'https://api.themoviedb.org/3/search/movie';
//     const queryString = `?query=${encodeURIComponent(queryParam)}&api_key=${TMDB_API}`;
//     const url = baseUrl + queryString;
//     const options = {
//         method: 'GET',
//         headers: {
//             accept: 'application/json',
//             Authorization: TMDB_API
//         }
//     }
//     return fetch(url, options)
//         .then(response => {
//             return response.json();
//         })
//         .catch(error => {
//             console.log(error);
//         })
// }

async function getMoviesBySearch(queryParam) {
    const baseUrl = 'https://api.themoviedb.org/3/search/movie';
    const queryString = `?query=${encodeURIComponent(queryParam)}&api_key=${TMDB_API}`;
    const url = baseUrl + queryString;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: TMDB_API
        }
    };

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}


// This gives me access to all the movies.  It was done with the discover filter, and the read access token
// function discoverAllMovies() {
//     const urlDiscover = 'https://api.themoviedb.org/3/discover/movie';
//     const optionsDiscover = {
//         method: 'GET',
//         headers: {
//             accept: 'application/json',
//             Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`
//         }
//     }
//
//     return fetch(urlDiscover, optionsDiscover)
//         .then(response => {
//             return response.json();
//         })
//         .then(data => {
//             return data;
//         })
//         .catch(error => {
//             console.log(error);
//         })
// }

async function discoverAllMovies() {
    const urlDiscover = 'https://api.themoviedb.org/3/discover/movie';
    const optionsDiscover = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`
        }
    };

    try {
        const response = await fetch(urlDiscover, optionsDiscover);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}


// This gives me access to all genres, genre id & genre name.  Turn this into a function? Declare it as a variable to use and map() corresponding genres?
// function genreList() {
//     const urlGenreList = 'https://api.themoviedb.org/3/genre/movie/list';
//     const optionsGenreList = {
//         method: 'GET',
//         headers: {
//             accept: 'application/json',
//             Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`
//         }
//     }
//     return fetch(urlGenreList, optionsGenreList)
//         .then(response => {
//             return response.json();
//         })
//         .then(data => {
//             return data;
//         })
//         .catch(error => {
//             console.log(error);
//         })
// }

async function genreList() {
    const urlGenreList = 'https://api.themoviedb.org/3/genre/movie/list';
    const optionsGenreList = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`
        }
    };

    try {
        const response = await fetch(urlGenreList, optionsGenreList);
        if (!response.ok) {
            throw new Error('Failed to fetch genre list');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// function getGenreName (genres, id) {
//     // Find genre object in the genres array
//     let genre = genres.find(genre => genre.id === id);
//
//     // Check if a genre was found, if not return a default value
//     if (!genre) {
//         return "Genre not found";
//     }
//
//     // Return the genre's name
//     return genre.name;
// }

function getGenreName(genres, id) {
    // Find genre object in the genres array and use optional chaining to handle the possibility of undefined
    const genre = genres.find(genre => genre.id === id)?.name;

    // Return the genre's name or a default value if genre is not found
    return genre || "Genre not found";
}

// ------------------------------------------------------------------------------------------------
// IIFE...
// (() => {
//     // Variables
//     const searchBar = document.querySelector('#search-bar');
//     // Functions...
//     discoverAllMovies().then(data => {
//         console.log(data);
//     });
//     genreList().then(data => {
//         console.log(data);
//     })
//
//     genreList().then(genres => {
//         // Events....
//         searchBar.addEventListener('keyup', (e) => {
//             if(e.keyCode === 13) {
//                 console.log(searchBar.value);
//                 getMoviesBySearch(searchBar.value).then(moviesData => {
//                     searchBar.value = '';
//                     console.log(`Fetch & then => `, moviesData);
//                     const firstFilter = moviesData.results.filter((movie) => {
//                         return movie.original_language === 'en' && movie.backdrop_path !== null;
//                     }).map((movie) => {
//                         return {
//                             ...movie,
//                             genre_names: movie.genre_ids.map(id => getGenreName(genres.genres, id))
//                         }
//                     });
//                     console.log(`firstFilter => `, firstFilter);
//                 })
//             }
//         })
//     })
//
// })();

(async () => {
    // Variables
    const searchBar = document.querySelector('#search-bar');

    // Function to fetch all movies and log the data
    discoverAllMovies().then(data => {
        console.log(data);
    });

    // Function to fetch the list of genres and log the data
    genreList().then(data => {
        console.log(data);
    });

    // Function to handle movie search and filter results
    const handleMovieSearch = async (genres) => {
        const moviesData = await getMoviesBySearch(searchBar.value);
        searchBar.value = '';
        console.log(`async & await => `, moviesData);

        const firstFilter = moviesData.results.filter((movie) => {
            return movie.original_language === 'en' && movie.backdrop_path !== null;
        }).map((movie) => {
            return {
                ...movie,
                genre_names: movie.genre_ids.map(id => getGenreName(genres.genres, id))
            };
        });

        console.log(`firstFilter => `, firstFilter);
    };

    // Fetch genres and set up event listener for search bar
    genreList().then(genres => {
        searchBar.addEventListener('keyup', (e) => {
            if (e.keyCode === 13) {
                console.log(searchBar.value);
                handleMovieSearch(genres);
            }
        });
    });
})();


// ------------------------------------------------------------------------------------------------
// Delete favMovie function...
const deleteFavMovie = async (id) => {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        }
    }
    const response = await fetch(`${DOMAIN}/favorites/${id}`, options);
    const apiResonse = await response.json();
    return apiResonse;
};

// 'GETTER function' ... get movies from favorites, db.json
const getFavoriteMovies = async () => {
    const response = await fetch(`${DOMAIN}/favorites`);
    const favorites = await response.json();
    return favorites;
}

// 'RENDER function' ... render favorite movies dynamically
const renderFavoriteMovies = async (favoritesParam) => {
    console.log(favoritesParam);
    const favMoviesDiv = document.querySelector('#favorite-movies');
    favoritesParam.forEach(favorite => {
        const dynamicMovieCard = document.createElement('div');
        dynamicMovieCard.classList.add("align-items-center", "favorite-cards", "col");
        dynamicMovieCard.innerHTML = `
            <form>
                <h2>${favorite.original_title}</h2>
                <p>Popularity: ${favorite.popularity}</p>
                <p>${favorite.overview}</p>
                <button class="remove-from-favorites">Remove</button>
            </form>
        `;
        favMoviesDiv.appendChild(dynamicMovieCard);
        let removeBtn = dynamicMovieCard.querySelector('.remove-from-favorites');
        removeBtn.addEventListener('click', async(e) => {
            e.preventDefault();
            console.log(dynamicMovieCard.innerHTML);
            const response = await deleteFavMovie(favorite.id);
            console.log(response);
            dynamicMovieCard.remove();
        })
    })
}

// ------------------------------------------------------------------------------------------------
// IIFE...
(async() => {
    const favorites = await getFavoriteMovies();
    console.log(favorites);
    renderFavoriteMovies(favorites);

})();

// ------------------------------------------------------------------------------------------------

