const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../scema.js");
const listing = require("../models/listing.js");
const { loogedin } = require("./middleware.js");


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//index route
router.get("/", wrapAsync(async (req, res) => {
    const alllisting = await listing.find({});
    res.render("listings/index.ejs", { alllisting });
})
);

//new route
router.get("/new",loogedin,(req, res) => {
    res.render("listings/new.ejs")
})

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const llisting = await listing.findById(id).populate("reviews").populate("owner");
    if(!llisting){
        req.flash("error","this listing is does not exist ")
        res.redirect("/listings");
    }
    console.log(llisting);
    res.render("listings/show.ejs", { llisting })
}));

//create route
router.post(
    "/",
    loogedin,
    validateListing,
    wrapAsync(async (req, res, next) => {
        const LLListing = new listing(req.body.listing);
        LLListing.owner = req.user._id;
        await LLListing.save();
        req.flash("success","new listing created!");
        res.redirect("/listings");
    })
);
//Edit Route
router.get("/:id/edit",loogedin, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const llisting = await listing.findById(id);
    
    if(!llisting){
        req.flash("error","this listing is does not exist ")
        res.redirect("/listings");
    }else{
        req.flash("success","listing is edited!");
    }
    res.render("listings/edit.ejs", { llisting })

}));

//Update route
router.put("/:id/",
    validateListing,loogedin,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await listing.findByIdAndUpdate(id, { ...req.body.listing })
        req.flash("success","Listing is Updated")
        res.redirect(`/listings/${id}`);
    }));

//delete route
router.delete("/:id",loogedin, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("deleted","listing is Deleted!");
    res.redirect("/listings")
}));

module.exports=router;