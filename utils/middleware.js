const mongoose = require("mongoose");

// TO CHECK USER IS LOGGED IN OR NOT BEFORE PERFORMING ANY OPERATIONS
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must had to logIn to access Todo list App!!");
    return res.redirect("/api/users/login");
  }
  next();
};

// TO CHECK THE VALID ID
const checkValidId = (req, res, next) => {
  let { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid Todo Id");
    return res.redirect("/api/todos");
  }
  next();
};


module.exports = {isLoggedIn,checkValidId};
