const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

 
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
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs",{listing}); 

});

app.post("/listings",async(req,res)=>{
    const { title, description, image, price, country, location } = req.body;

    const newListing = new Listing({
        title,
        description,
        image: {
            filename: "listingimage",   // default or generated
            url: image                 // user-provided input
        },
        price,
        country,
        location
    });

    await newListing.save();
    res.redirect("/listings");

});

//update route
// UPDATE route
app.put("/listings/:id", async (req, res) => {
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
});


app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
});


//delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");   // after deleting, go back to all listings
});



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

app.listen(8080,()=>{
    console.log("server is listening!");
});