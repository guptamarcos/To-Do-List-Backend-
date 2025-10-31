const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");
const Todo = require("./todoSchema.js");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  allTodos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

userSchema.post("findOneAndDelete", async(currUser)=>{
  if(currUser.allTodos.length){
    let deleteTodos = await Todo.deleteMany({_id:{$in : currUser.allTodos}});
  }
})
const User = mongoose.model("User", userSchema);

module.exports = User;
