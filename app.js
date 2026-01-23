const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const expressError = require("./utils/expressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


 
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res)=>{
    res.send("request is sent")
});



app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)


// app.get("/testlisting",async(req,res) =>{
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 12000,
//         location:"Sajek",
//         contry: "Bangladesh",
//     });

//     await sampleListing.save();
//     console.log("sampleListing");
//     res.send("Successful testing");
// });
app.all('/*path', (req, res, next) => {
    next(new expressError(404, "This page is not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 600, message = "somehthing went wrong!"} = err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message})
})
// app.use((err,req,res,next)=>{
//     res.send("something went wrong");       //this was made for wrapAsync in 4th video
//     next();
// }) 

app.listen(8080,()=>{
    console.log("server is listening!");
});