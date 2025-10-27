const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
});

const Todo = mongoose.model("Todo",todoSchema);

module.exports = Todo;