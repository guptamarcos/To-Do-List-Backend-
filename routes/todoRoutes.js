const express = require("express");
const router = express.Router();
const Todo = require("../model/todoSchema.js");
const User = require("../model/userSchema.js");
const isLoggedIn = require("../utils/middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

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
// TO EDIT THE EXISTING TODO WORK
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    const { id } = req.params;
    const currTodo = await Todo.findById(id);
    res.render("todos/Edit.ejs",{currTodo});
}));

// UPDATE ROUTE 
// UPDATE THE TODO WORK
router.patch("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    const { id } = req.params;
    const { content } = req.body;
    const currTodo = await Todo.findByIdAndUpdate(id, {content: content});
    res.redirect("/api/todos");
}));

// DELETE ROUTE
// DELETE THE TODO FROM THE TODO LIST 
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    const { id } = req.params;
    let deleteTodo = await Todo.findByIdAndDelete(id);
    const currUser = await User.findByIdAndUpdate(req.user._id,{$pull:{allTodos:id}});
    res.redirect("/api/todos");
}));

module.exports = router;