const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "Review Created!");
  res.redirect(`/listings/${req.params.id}`);

  // res.redirect(`listings/:${req.params.id}/show.ejs`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findById(reviewId);

  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
};
