const router = require("express").Router({mergeParams: true})
const controller = require("./reviews.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

//all routes for the 'reviews' resource.
router.route("/:reviewId").put(controller.update).delete(controller.delete).all(methodNotAllowed)

module.exports = router