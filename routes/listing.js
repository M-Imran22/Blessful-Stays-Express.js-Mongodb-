const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const { isLoggedIn, isOwner, validationListing } = require("../middlewears.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validationListing,
    wrapAsync(listingController.createNewListing)
  );

//New route
router.get("/new", isLoggedIn, listingController.newListingForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm)
);

module.exports = router;
