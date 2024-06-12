const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../util/wrapAsync.js");
const reviewController = require("../controllers/review.js");
const {
  validationReviews,
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewears.js");

//Post Route
router.post(
  "/",
  isLoggedIn,
  validationReviews,
  wrapAsync(reviewController.createReview)
);

//Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
