const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const Movie = require("./models/movie");
const Review = require("./models/review");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
/*backend connection*/
mongoose.connect("mongodb://localhost:27017/moviereview")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));
/* Register */
app.post("/register", async(req,res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    await user.save();
    res.json({message:"User Registered Successfully"});
});
/* LOGIN */
app.post("/login", async(req,res)=>{
try{
const user = await User.findOne({email:req.body.email});
if(!user){
return res.json({message:"Invalid Email or Password"})
}
const match = await bcrypt.compare(req.body.password,user.password);
if(!match){
return res.json({message:"Invalid Email or Password"});
}
res.json({
message:"Login Successful",
user:user
});
}catch(err){
res.json({message:"Login Error"});
}
});
app.post("/addMovie", async(req,res)=>{
    const movie = new Movie(req.body);
    await movie.save();
    res.send({message:"Movie Added"});
});
 //Get Movies 
app.get("/movies", async(req,res)=>{
    const movies = await Movie.find();
    res.json(movies);
});
//delete movie
app.delete("/deleteMovie/:id", async (req,res)=>{
const id = req.params.id;
await Movie.findByIdAndDelete(id);
res.json({message:"Movie Deleted"});
});
 //Add Review 
app.post("/review", async(req,res)=>{
    const review = new Review(req.body);
    await review.save();
    res.send("Review Added");
});
 //Get Reviews 
app.get("/reviews/:movieId", async(req,res)=>{
    const reviews = await Review.find({movieId:req.params.movieId});
    res.json(reviews);
});
app.listen(3000,()=>{
    console.log("Server running on port 3000");
});