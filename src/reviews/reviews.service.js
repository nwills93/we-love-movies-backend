const knex = require("../db/connection")
const mapProperties = require("../utils/map-properties")

//configuration which organizes these properties into a 'critic' object.
const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name"
})

//SELECT * FROM reviews WHERE review_id = 'reviewId'
function read(reviewId) {
    return knex("reviews").select("*").where({"review_id": reviewId}).first()
}

//combines two queries into one function to properly update a review's score and then return with data joined from the 'critics' table.
async function update(updatedReview) {

    //UPDATE reviews as r SET r.score = 'updatedReview.score' WHERE r.review_id = 'updatedReview.review_id'
    await knex("reviews as r")
        .select("*")
        .where({"r.review_id": updatedReview.review_id})
        .update(updatedReview)

    //SELECT * FROM reviews as r JOIN critics as c ON r.critic_id = c.critic_id WHERE r.review_id = 'updatedReview.review_id'
    //then map the properties defined in addCritic
    const response = await knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .where({"r.review_id": updatedReview.review_id})
        .then((updatedRow) => updatedRow[0])
        .then(addCritic);

    return response
}

//DELETE FROM reviews WHERE review_id = 'review_id'
function destroy(reviewId) {
    return knex("reviews").where({"review_id": reviewId}).del()
}

module.exports = {
    read,
    update,
    delete: destroy
}