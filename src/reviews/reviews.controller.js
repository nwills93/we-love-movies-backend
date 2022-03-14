const reviewsService = require("./reviews.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

//validation function to check if review exists.
async function reviewExists(req, res, next) {
    const reviewId = req.params.reviewId
    const foundReview = await reviewsService.read(reviewId)
    if (foundReview) {
        res.locals.review = foundReview
        next()
    } else {
        next({status: 404, message: "Review cannot be found."})
    }
}

//updates one review.
async function update(req, res, next) {
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id
    }
    const data = await reviewsService.update(updatedReview)
    res.json({data})
}

//deletes one review.
async function destroy(req, res, next) {
    const {review} = res.locals
    await reviewsService.delete(review.review_id)
    res.sendStatus(204)
}

module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)]
}