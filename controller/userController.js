const User = require("../model/userSchema.js");
const ExpressError = require("../utils/ExpressError.js");
const { signupValidate } = require("../utils/schemaValidator.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signupForm.ejs");
};

module.exports.signupUser = async (req, res) => {
  const { error, value } = signupValidate.validate(req.body);
  if (error) {
    throw new ExpressError(400, "Invalid Data");
  }
  const { username, email, password } = value;
  const user = await User.findOne({ email: email });
  if (user) {
    throw new ExpressError(409, "Email id is already exist");
    return;
  }
  try {
    const newUser = new User({ username, email });
    const currUser = await User.register(newUser, password);
    req.login(currUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Hi @${username}, Welcome to the Todo List App`);
      res.redirect("/api/todos");
    });
  } catch (e) {
    throw new ExpressError(409, "User is already Exist");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/loginForm.ejs");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success",`Hi @${req.user.username}, Welcome to the Todo List App`);
  res.redirect("/api/todos");
};

module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out from the App");
    res.redirect("/api");
  });
}

module.exports.renderDeleteForm = (req, res) => {
  res.render("users/deleteUserForm.ejs");
}

module.exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const { username, password } = req.body;

  const currUserInfo = await User.findById(id);
  if (!currUserInfo) {
    req.flash("error", "User not found!");
    return res.redirect("/api/todos");
  }

  if (currUserInfo.username !== username) {
    throw new ExpressError(409, "Username is Incorrect");
  }

  const { user, error } = await currUserInfo.authenticate(password);

  if (error) {
    throw new ExpressError(409, "Password is incorrect");
  }
  let deletedUser = await User.findByIdAndDelete(id);
    req.logout((err) => {
      if (err) return next(err);
      req.flash("success", `${deletedUser.username} deleted successfully.`);
      res.redirect("/api");
  });
}