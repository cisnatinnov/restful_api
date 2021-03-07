const mongoose = require("mongoose");

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    task: String,
		date: Date,
		time: String
  })
);

module.exports = Task;