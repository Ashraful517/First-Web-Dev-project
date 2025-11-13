const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{ 
        type: String
    },
    description: String,
    image: {
        filename: { type: String, default: "listingimage" },
        url: { 
            type: String, 
            default: "https://unsplash.com/photos/a-house-with-a-blue-front-door-and-a-brown-front-door-xaqsFfoEq3o"
        }
    },
    price: Number,
    location: String,
    country:String
});

const Listing = mongoose.model("Listing", listingSchema);       //mongoose.model(modelname,schema)
module.exports = Listing;