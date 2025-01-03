const { types, ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: [true, 'Listing description is required'] },

    image: {
        type: String,
        default: "https://w0.peakpx.com/wallpaper/600/646/HD-wallpaper-maldives-resort-ocean-resorts-pier-lights-sky.jpg" ,

        set: (v) =>
            v === ""
                ? "https://w0.peakpx.com/wallpaper/600/646/HD-wallpaper-maldives-resort-ocean-resorts-pier-lights-sky.jpg"
                : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
        type : Schema.Types.ObjectId,
        ref : "Review",
    },
],
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

