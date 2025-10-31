const express = require("express");
const router = express.Router();
const {isLoggedIn,checkValidId} = require("../utils/middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const todoController = require("../controller/todosController.js");

// HOME ROUTE (INDEX ROUTE) 
// WHERE ALL THE TODOS OF THE USER IS SHOWN
router.get("/",isLoggedIn,wrapAsync(todoController.getAllTodos));

// POST ROUTE 
// ADD NEW TODO TO THE LIST
router.post("/new",isLoggedIn,wrapAsync(todoController.addNewTodo));

// EDIT FORM  
router.get("/:id/edit", isLoggedIn,checkValidId, wrapAsync(todoController.renderEditForm));

// UPDATE ROUTE 
router.patch("/:id", isLoggedIn, checkValidId, wrapAsync(todoController.updateCurrTodo));


// DELETE ROUTE
// DELETE THE TODO FROM THE TODO LIST 
router.delete("/:id",isLoggedIn,checkValidId,wrapAsync(todoController.deleteTodo));

module.exports = router;