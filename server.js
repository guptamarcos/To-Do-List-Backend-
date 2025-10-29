require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const methodOverride = require("method-override");
const todoRoutes = require("./routes/todoRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./model/userSchema.js");

const mongoDB_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/todoDb";
async function main() {
  await mongoose.connect(mongoDB_URL);
}

main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

const sessionOption = {
  secret: process.env.SECRET || "mySecretCode",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/todoDb",
    touchAfter: 24 * 3600, 
  }),
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// HERE WE ARE STORING SOME LOCAL VARIABLES
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ENTRY PAGE OF TODO LIST APP
app.get("/api", (req, res) => {
  res.render("todos/Index.ejs");
});

// APPLICATION ROUTES
app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);

// IF PATH IS NOT MATCHING TO THE GIVEN ROUTES THAN SHOW PAGE NOT FOUND
app.use((req, res, next) => {
  res.status(404).send("<h1>Page not found!!</h1>");
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Some Went Wrong!!" } = err;
  res.render("partials/error.ejs", { message });
});

// CREATE AND START THE SERVER ON THE GIVEN PORT
app.listen(port, (req, res) => {
  console.log(`Server is listening on the port ${port}`);
});
