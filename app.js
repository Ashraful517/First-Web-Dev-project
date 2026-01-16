const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");


 
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


const validateListing  = (req,res,next)=>{
    const error = listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");  // all error message separated with comma.
        throw new expressError(400,errMsg);
    }else{
        next();
    }
};

const validateReview = (req, res, next) => { 
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new expressError(400, errMsg);
    }
    next();
};


app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings}); 
});


//new route
//new route is above of the show route cause in show route we have :id. If we put new route under it, 
//...the machine thinks the word 'new' as an id.
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});

//show route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing}); 

});

app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{

    const { title, description, image, price, country, location } = req.body;
    const newListing = new Listing({
        title,
        description,
        price,
        country,
        location
    });
    if (image && image.trim() !== "") {
    newListing.image = {
        filename: "listingimage",
        url: image,
    };
}

    await newListing.save();
    res.redirect("/listings");
    })
);

//update route
app.put("/listings/:id",validateListing,wrapAsync( async (req, res) => {
    const { id } = req.params;
    let { title, description, image, price, country, location } = req.body;

    // Update listing 
    await Listing.findByIdAndUpdate(id, {
        title,
        description,
        image: {
            filename: "listingimage",
            url: image
        },
        price,
        country,
        location
    });

    res.redirect(`/listings/${id}`); // after update, redirect to show page
})
);

//edit route
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));


//delete route
app.delete("/listings/:id",wrapAsync( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");   // after deleting, go back to all listings
}));

//Review Post Route
app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res) =>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))

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