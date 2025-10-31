const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { checkValidId } = require("../utils/middleware.js");
const userController = require("../controller/userController.js");

// IT WILL RENDER SIGN UP FORM RENDER
router.get("/signup", userController.renderSignupForm);

// IT WILL FETCH USER DETAILS AND SAVE IT INTO THE USER MODEL
router.post("/signup",wrapAsync(userController.signupUser));

// IT WILL RENDER LOGIN FORM
router.get("/login", userController.renderLoginForm);

// IT WILL CHECK LOGIN CREDENTIALS
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/api/users/login",
    failureFlash: "Invalid Username or Password",
  }),
  wrapAsync(userController.loginUser)
);

// LOGOUT ROUTE
router.get("/logout", userController.logoutUser);

// DELETE ROUTE
router.get("/:id/deleteUser", checkValidId, userController.renderDeleteForm);

router.delete("/:id",checkValidId,wrapAsync(userController.deleteUser));

module.exports = router;
