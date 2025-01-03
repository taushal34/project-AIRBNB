const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../scema.js");
const listing = require("../models/listing.js");


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
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const llisting = await listing.findById(id).populate("reviews")
    res.render("listings/show.ejs", { llisting })
}));

//create route
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {


        const LLListing = new listing(req.body.listing);
        await LLListing.save();
        res.redirect("/listings");

    })
);

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const llisting = await listing.findById(id);
    res.render("listings/edit.ejs", { llisting })

}));

//Update route
router.put("/:id/",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await listing.findByIdAndUpdate(id, { ...req.body.listing })
        res.redirect(`/listings/${id}`);
    }));

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings")
}));

module.exports=router;