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
            default: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        }
    },
    price: Number,
    location: String,
    country:String
});

const Listing = mongoose.model("Listing", listingSchema);       //mongoose.model(modelname,schema)
module.exports = Listing;