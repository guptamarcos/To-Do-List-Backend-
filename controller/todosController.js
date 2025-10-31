const Todo = require("../model/todoSchema.js");
const User = require("../model/userSchema.js");
const ExpressError = require("../utils/ExpressError.js");
const { todoValidate } = require("../utils/schemaValidator.js");

module.exports.getAllTodos = async(req,res)=>{
  const user = await User.findById(req.user._id).populate("allTodos");
  const allTodos = user.allTodos;
  res.render("todos/Home.ejs",{ allTodos });
}

module.exports.addNewTodo = async(req,res)=>{
  const { error, value } = todoValidate.validate(req.body.currTodoWork);
  if(!error){
    throw new ExpressError(409,"Input field can't be empty");
  }
  const newTodo = new Todo({content : value});
  await newTodo.save();
  const currUser = await User.findByIdAndUpdate(req.user._id,{$push:{allTodos:newTodo}});
  res.redirect("/api/todos");
}

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const currTodo = await Todo.findById(id);

  if (!currTodo) {
    req.flash("error", "Todo not found");
    return res.redirect("/api/todos");
  }
  
  res.render("todos/Edit.ejs", { currTodo });
}

module.exports.updateCurrTodo = async (req, res) => {
  const { id } = req.params;
  const { error, value } = todoValidate.validate(req.body.content);

  if(!error){
    throw new ExpressError(409,"Input field can't be empty");
  }
  const currTodo = await Todo.findByIdAndUpdate(id, { value });

  if (!currTodo) {
    req.flash("error", "Todo not found");
    return res.redirect("/api/todos");
  }

  req.flash("success", "Todo updated successfully");
  res.redirect("/api/todos");
}

module.exports.deleteTodo = async(req,res)=>{
  const { id } = req.params;
  let deleteTodo = await Todo.findByIdAndDelete(id);

  if (!deleteTodo) {
    req.flash("error", "Todo not found");
    return res.redirect("/api/todos");
  }
    
  const currUser = await User.findByIdAndUpdate(req.user._id,{$pull:{allTodos:id}});
  res.redirect("/api/todos");
}