import {
    discoverAllMovies,
    genreList,
    getFavoriteMovies,
    renderFavoriteMovies,
    handleMovieSearch,
    renderSearchedMovies,
} from './movie-project-utils.js'
console.log(`hello from movie-project-main.js`);

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
    const genres = await genreList();
    const searchBar = document.querySelector('#search-bar');
    searchBar.addEventListener('keyup', async(e) => {
        if (e.keyCode === 13) {
            console.log(searchBar.value);
            const firstFilter = await handleMovieSearch(genres);
            console.log(`from within event listener...=>`, firstFilter); // Now firstFilter variable is available!!!
            const movieNodes = await renderSearchedMovies(firstFilter);

        }
    });


    const favorites = await getFavoriteMovies();
    console.log(favorites);
    let favoritesRatingSorted = favorites.sort((a, b) => {
        return b.rating - a.rating;
    })
    console.log(favoritesRatingSorted);
    await renderFavoriteMovies(favoritesRatingSorted);

    // Tooltip Testing
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    console.log(tooltipTriggerList);
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))



})();
// ------------------------------------------------------------------------------------------------

