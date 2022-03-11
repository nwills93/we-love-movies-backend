const knex = require("../db/connection")
const mapProperties = require("../utils/map-properties")

const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    created_at: "critic.created_at",
    updated_at: "critic.updated_at",
})

function list() {
    return knex("movies").select("*")
}

function listMoviesThatAreCurrentlyShowing() {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .distinct("m.*")
        .where({"is_showing": true})
        .orderBy("m.movie_id")
}

function read(movieId) {
    return knex("movies").select("*").where({"movie_id": movieId}).first()
}

function listAllTheatersForAMovie(movieId) {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .join("theaters as t", "t.theater_id", "mt.theater_id")
        .select("t.*", "mt.is_showing", "m.movie_id")
        .where({"m.movie_id": movieId})
}

function listAllReviewsForAMovie(movieId) {
    return knex("movies as m")
        .join("reviews as r", "m.movie_id", "r.movie_id")
        .join("critics as c", "c.critic_id", "r.critic_id")
        .select("r.*", "c.*")
        .where({"m.movie_id": movieId})
        .then(response => {
            return response.map((row) => {
                return addCritic(row)
            })
        })
}

module.exports = {
    read,
    list,
    listMoviesThatAreCurrentlyShowing,
    listAllTheatersForAMovie,
    listAllReviewsForAMovie,
}