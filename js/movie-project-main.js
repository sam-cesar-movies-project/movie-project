"use strict";
console.log(`hello from movie-project-main.js`);

const DOMAIN = 'http://localhost:3000';
// fire up json server: json-server --watch data/db.json


//////////////////////////////////////////////////////////////////////////////////////////////////
// Functions...
// GETTER Get Movies by Search function:
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
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}


// This gives me access to all the movies.  It was done with the discover filter, and the read access token
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

// Fetch genreList
// This gives me access to all genres, genre id & genre name.  Turn this into a function? Declare it as a variable to use and map() corresponding genres?
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
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

// Function to be used within map() `genre ids to genre names`
function getGenreName (genres, id) {
    // Find genre object in the genres array
    let genre = genres.find(genre => genre.id === id);

    // Check if a genre was found, if not return a default value
    if (!genre) {
        return "Genre not found";
    }

    // Return the genre's name
    return genre.name;
}

// Function to handle movie search and filter results
async function handleMovieSearch (genres) {
    // Variables
    const searchBar = document.querySelector('#search-bar');
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
    return firstFilter;
}
//////////////////////////////////////////////////////////////////////////////////////////////////

// CRUD ...............................
// 'GETTER function' ... get movies from favorites, db.json
const getFavoriteMovies = async () => {
    const response = await fetch(`${DOMAIN}/favorites`);
    const favorites = await response.json();
    return favorites;
}

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

// Add to favorite movies...
const addToFavorites = async (resultParam) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resultParam)
    };
    const response = await fetch(`${DOMAIN}/favorites`, options);
    const apiResponse = response.json();
    return apiResponse;
}

// Edit Favorites...
const editFavorites = async (favoriteObj, selectedRating) => {
    // console.log(favoriteId, selectedRating);
    // Find the movie with the passed in id
    // add update the rating
    const movie = {
        ...favoriteObj,
        rating: parseFloat(selectedRating)
    }
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movie)
    };
    const response = await fetch(`${DOMAIN}/favorites/${favoriteObj.id}`, options);
    const apiResponse = response.json();
    return apiResponse;
}

// 'RENDER function' ... render favorite movies dynamically
const renderFavoriteMovies = async (favoritesParam) => {
    console.log(favoritesParam);
    const favMoviesDiv = document.querySelector('#favorite-movies');
    favoritesParam.forEach(favorite => {
        // if (typeof favorite.rating === 'undefined') {
        //     favorite.rating = 1;
        // }
        const dynamicMovieCard = document.createElement('div');
        dynamicMovieCard.classList.add("align-items-center", "favorite-cards", "col");
        dynamicMovieCard.innerHTML = `
            <form>
                <div class="myCard">
                    <div class="innerCard">
                        <div class="frontSide">
                            <img src="https://image.tmdb.org/t/p/w500/${favorite.poster_path}">
                        </div>
                        <div class="backSide">
                            <div>
                            <!-- this is the trash can button -->
                                <button class="remove-from-favorites" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                                </svg></button>
                            <!-- this is the end of the trash can button-->
                                <h2 class="backSide-text-color">${favorite.original_title}</h2>
                            </div>
                            <p>${favorite.genre_names.join(", ")}</p>
                            <p class="backSide-text-color">Rating: ${favorite.rating ? favorite.rating : 1}</p>
                            <p class="backSide-text-color">Popularity: ${favorite.popularity}</p>
                            <p class="overview">${favorite.overview}</p>           
                            
                            <div>
                                <label for="movie-rating">Rate</label>
                                <select id="movie-rating" name="movie-rating">
                                    <option value="5">5</option>
                                    <option value="4">4</option>
                                    <option value="3">3</option>
                                    <option value="2">2</option>
                                    <option value="1" selected>1</option>
                                </select>
                                <button id="rate-btn">submit rating</button>
                            </div>
                        </div>
                    </div>
                </div>               
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
        let ratingSelect = dynamicMovieCard.querySelector('#movie-rating');
        let ratingBtn = dynamicMovieCard.querySelector('#rate-btn');
        ratingBtn.addEventListener('click', async(e) => {
            e.preventDefault();
            console.log(ratingSelect.value);
            const response = await editFavorites(favorite, ratingSelect.value);
            console.log(response);
        })
    })
};

const renderSearchedMovies = async (filterParam) => {
    console.log(filterParam);
    const serchedMovieParentDiv = document.querySelector('#searched-movies');
    serchedMovieParentDiv.innerHTML = ``;
    filterParam.forEach(result => {
        const dynamicSearchedMovie = document.createElement('div');
        dynamicSearchedMovie.classList.add("align-items-center", "searched-cards", "col");
        dynamicSearchedMovie.innerHTML = `
            <form>
                <div class="myCard">
                    <div class="innerCard">
                        <div class="frontSide">
                            <img src="https://image.tmdb.org/t/p/w500/${result.poster_path}">                           
                        </div>
                        <div class="backSide">
                        <h2 class="backSide-text-color">${result.original_title}</h2>
                            <p>${result.genre_names.join(", ")}</p>
                            <p class="backSide-text-color">Popularity: ${result.popularity}</p>
                            <p class="overview">${result.overview}</p>
                            <button class="add-to-favorites">Add to Favorites</button>
                        </div>
                    </div>
                </div>
                
                
            </form>
        `;
        serchedMovieParentDiv.appendChild(dynamicSearchedMovie);
        let addBtn = dynamicSearchedMovie.querySelector('.add-to-favorites');
        addBtn.addEventListener('click', async(e) => {
            e.preventDefault();
            console.log(serchedMovieParentDiv);
            const response = await addToFavorites(result);
            console.log(response);
            const favMoviesDiv = document.querySelector('#favorite-movies');
            favMoviesDiv.innerHTML = ``;
            await renderFavoriteMovies(await getFavoriteMovies());
        })
    })
};

// ------------------------------------------------------------------------------------------------
// IIFE...
(async () => {

    // Function to fetch all movies and log the data
    discoverAllMovies().then(data => {
        console.log(data);
    });

    // Function to fetch the list of genres and log the data
    genreList().then(data => {
        console.log(data);
    });


    // Fetch genres and set up event listener for search bar
    genreList().then(genres => {
        const searchBar = document.querySelector('#search-bar');
        searchBar.addEventListener('keyup', async(e) => {
            if (e.keyCode === 13) {
                console.log(searchBar.value);
                const firstFilter = await handleMovieSearch(genres);
                console.log(`from within event listener...=>`, firstFilter); // Now firstFilter variable is available!!!
                renderSearchedMovies(firstFilter);


            }
        });
    });


    let favorites = await getFavoriteMovies();
    console.log(favorites);
    renderFavoriteMovies(favorites);



})();
// ------------------------------------------------------------------------------------------------

