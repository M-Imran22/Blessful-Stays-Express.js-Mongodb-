const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../util/wrapAsync.js");
const Review = require("../models/reviews.js");
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
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review Created!");
    res.redirect(`/listings/${req.params.id}`);

    // res.redirect(`listings/:${req.params.id}/show.ejs`);
  })
);

//Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findById(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
