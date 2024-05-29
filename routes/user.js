const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../util/wrapAsync.js");
const user = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewears.js");

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new user({ username, email });
      const registeredUser = await user.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          next(err);
        } else {
          req.flash("success", "Welcom to Blessful Stays");
          res.redirect("/listings");
        }
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", `Welcom back '${req.body.username}'`);
    let RedirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(RedirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
    }
  });
});

module.exports = router;
