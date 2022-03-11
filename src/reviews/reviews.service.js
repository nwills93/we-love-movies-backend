const knex = require("../db/connection")
const mapProperties = require("../utils/map-properties")

const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name"
})

function read(reviewId) {
    return knex("reviews").select("*").where({"review_id": reviewId}).first()
}

 async function update(updatedReview) {
    await knex("reviews as r")
        .select("*")
        .where({"r.review_id": updatedReview.review_id})
        .update(updatedReview)

    const response = await knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .where({"r.review_id": updatedReview.review_id})
        .then((updatedRow) => updatedRow[0])
        .then(addCritic);

    return response
}

function destroy(reviewId) {
    return knex("reviews").where({"review_id": reviewId}).del()
}

module.exports = {
    read,
    update,
    delete: destroy
}