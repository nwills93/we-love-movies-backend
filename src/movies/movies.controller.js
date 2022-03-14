const moviesService = require("./movies.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

//lists all movies. If query is provided, lists all movies that are currently showing.
async function list(req, res, next) {
    if (req.query.is_showing === 'true') {
        res.json({data: await moviesService.listMoviesThatAreCurrentlyShowing()})
    } else {
        const data = await moviesService.list()
        res.json({data})
    }   
}

//validation function to check if a movie exists.
async function movieExists(req, res, next) {
    const movieId = req.params.movieId
    const foundMovie = await moviesService.read(movieId)
    if (foundMovie) {
        res.locals.movie = foundMovie
        next()
    } else {
        next({status: 404, message: "Movie cannot be found."})
    }
}

//lists one movie found by its movie_id.
async function read(req, res) {
    res.json({data: res.locals.movie})
}

//lists all theaters for one movie.
async function listAllTheatersForAMovie(req, res, next) {
    const {movie} = res.locals
    const data = await moviesService.listAllTheatersForAMovie(movie.movie_id)
    res.json({data})
}

//lists all reviews for one movie.
async function listAllReviewsForAMovie(req, res, next) {
    const {movie} = res.locals
    const data = await moviesService.listAllReviewsForAMovie(movie.movie_id)
    res.json({data})
}

module.exports = {
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    list: asyncErrorBoundary(list),
    listAllTheatersForAMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listAllTheatersForAMovie)],
    listAllReviewsForAMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listAllReviewsForAMovie)]
}