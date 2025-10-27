const express = require("express");
const router = express.Router();
const User = require("../model/userSchema.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");

// IT WILL RENDER SIGN UP FORM RENDER
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// IT WILL FETCH USER DETAILS AND SAVE IT INTO THE USER MODEL
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const currUser = await User.register(newUser, password);
    req.login(currUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Hi @${username}, Welcome to the Todo List App`);
      res.redirect("/api/todos");
    });
  })
);

// IT WILL RENDER LOGIN FORM
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// IT WILL CHECK LOGIN CREDENTIALS
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/api/users/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash(
      "success",
      `Hi @${req.user.username}, Welcome to the Todo List App`
    );
    res.redirect("/api/todos");
  })
);

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("Error", "You are logged out from the App");
    res.redirect("/api");
  });
});

// DELETED ROUTE
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteUser = await User.findByIdAndDelete(id);
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `${deleteUser.username} is deleted successfully`);
      res.redirect("/api");
    });
  })
);
module.exports = router;
