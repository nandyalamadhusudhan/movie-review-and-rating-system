const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
movieId:String,
userId:String,
review:String,
rating:Number
});
module.exports = mongoose.model("Review", reviewSchema);