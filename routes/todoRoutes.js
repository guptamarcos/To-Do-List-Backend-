const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Todo = require("../model/todoSchema.js");
const User = require("../model/userSchema.js");
const {isLoggedIn,checkValidId} = require("../utils/middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

// HOME ROUTE (INDEX ROUTE) 
// WHERE ALL THE TODOS OF THE USER IS SHOWN
router.get("/",isLoggedIn,wrapAsync(async(req,res)=>{
   const user = await User.findById(req.user._id).populate("allTodos");
   const allTodos = user.allTodos;
   res.render("todos/Home.ejs",{ allTodos });
}));

// POST ROUTE 
// ADD NEW TODO TO THE LIST
router.post("/new",isLoggedIn,wrapAsync(async(req,res)=>{
    const newTodo = new Todo({content : req.body.currTodoWork});
    await newTodo.save();
    const currUser = await User.findByIdAndUpdate(req.user._id,{$push:{allTodos:newTodo}});
    res.redirect("/api/todos");
}));

// EDIT FORM  
router.get("/:id/edit", isLoggedIn,checkValidId, wrapAsync(async (req, res) => {
  const { id } = req.params;

  const currTodo = await Todo.findById(id);
  if (!currTodo) {
    req.flash("error", "Todo not found");
    return res.redirect("/api/todos");
  }

  res.render("todos/Edit.ejs", { currTodo });
}));

// UPDATE ROUTE 
router.patch("/:id", isLoggedIn,checkValidId, wrapAsync(async (req, res) => {
  const { id } = req.params;

  const { content } = req.body;
  const currTodo = await Todo.findByIdAndUpdate(id, { content });

  if (!currTodo) {
    req.flash("error", "Todo not found");
    return res.redirect("/api/todos");
  }

  req.flash("success", "Todo updated successfully");
  res.redirect("/api/todos");
}));


// DELETE ROUTE
// DELETE THE TODO FROM THE TODO LIST 
router.delete("/:id",isLoggedIn,checkValidId,wrapAsync(async(req,res)=>{
    const { id } = req.params;
    let deleteTodo = await Todo.findByIdAndDelete(id);

    if (!deleteTodo) {
      req.flash("error", "Todo not found");
      return res.redirect("/api/todos");
    }
    
    const currUser = await User.findByIdAndUpdate(req.user._id,{$pull:{allTodos:id}});
    res.redirect("/api/todos");
}));

module.exports = router;