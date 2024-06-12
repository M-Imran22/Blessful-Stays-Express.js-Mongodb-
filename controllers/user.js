const user = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signup = async (req, res) => {
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
};

module.exports.renderLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", `Welcom back '${req.body.username}'`);
  let RedirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(RedirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
    }
  });
};
