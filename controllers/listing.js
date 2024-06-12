const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.newListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let id = req.params.id;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createNewListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  const url = req.file.path;
  const filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let finalListing = await newListing.save();
  // console.log(finalListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.editForm = async (req, res) => {
  let id = req.params.id;
  const listing = await Listing.findById(id);

  let imgUrl = listing.image.url;
  imgUrl = imgUrl.replace("/upload", "/upload/h_200,w_250");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing, imgUrl });
};

module.exports.updateListing = async (req, res) => {
  let id = req.params.id;

  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file != "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", " Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let id = req.params.id;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
