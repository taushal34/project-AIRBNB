const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../scema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");




const validateReviews= (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
//review Route
//POST 

router.post("/",validateReviews, async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
});


//review Route
//for delete 
router.delete("/:reviewId", 
    wrapAsync(async (req, res) => {

        let {id, reviewId} = req.params;
        await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
        await Review.findByIdAndDelete(reviewId);

        res.redirect (`/listings/${id}`);
}))

module.exports=router;