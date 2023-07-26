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


    let favorites = await getFavoriteMovies();
    console.log(favorites);
    await renderFavoriteMovies(favorites);



})();
// ------------------------------------------------------------------------------------------------

