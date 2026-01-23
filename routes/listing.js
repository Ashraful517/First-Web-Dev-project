const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new expressError(400, errMsg);
    }
    next();
};


router.get("/",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings}); 
});


//new route
//new route is above of the show route cause in show route we have :id. If we put new route under it, 
//...the machine thinks the word 'new' as an id.
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
});

//show route
router.get("/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing}); 

});

router.post("/",validateListing,wrapAsync(async(req,res,next)=>{

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
router.put("/:id",validateListing,wrapAsync( async (req, res) => {
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
router.get("/:id/edit",wrapAsync( async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));


//delete route
router.delete("/:id",wrapAsync( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");   // after deleting, go back to all listings
}));

module.exports = router;