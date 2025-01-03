const express = require("express")
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path =require("path");
const methodoverride = require("method-override")
const ejsMate= require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./scema.js");
const Review = require("./models/review.js");
const Listing = require("./models/listing.js");


let mongo_url="mongodb://127.0.0.1:27017/wonderlust"

main()
    .then(()=>{
        console.log("conected to DB")
    }).catch((err)=>{
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongo_url)
    
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}))
app.use(express.json());
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));






app.get("/",(req,res)=>{
    res.send("ready")
})

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
 console.log(error);
 if(error){
    let errMsg =error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
 }else{
    next();
 }
}


//index route
app.get("/listings", wrapAsync(async(req,res)=>{
   const alllisting=await listing.find({});
   res.render("listings/index.ejs",{alllisting});
    })
);

 //new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
    })

//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} =req.params;
    const llisting = await listing.findById(id)
    res.render("listings/show.ejs",{llisting})
}));

//create route
app.post(
    "/listings",
    validateListing,
    wrapAsync(async(req,res,next)=>{

 
    const LLListing =new listing(req.body.listing);
    await LLListing.save();
    res.redirect("/listings");
  
})
);

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} =req.params;
    const llisting = await listing.findById(id);
    res.render("listings/edit.ejs",{llisting})
})  );

//Update route
app.put("/listings/:id/",
   validateListing,
    wrapAsync(async(req,res)=>{
    let {id} =req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`);
}) );

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} =req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings")
}) );
   
//review Route
//POST 
 
app.post("/listings/:id/reviews",async(req,res)=>{

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

 res.redirect(`/listings/${listing._id}`);
});


// app.get("/testlisting",async(req,res)=>{
//     let sampleListing= new listing({
//         title : "my new vila",
//         description : "Swety villa",
//         price : 7000,
//         location : "goa" , 
//         country : "india"
//     });

//     await sampleListing .save();
//     console.log ("listing is save");
//     res.send("sucessful save")
// })



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong" } = err;
//     res.status(statusCode).render("listings/err.ejs", { message });
//     // Alternative plain-text response:
//     res.status(statusCode).send(message);


    app.use((err, req, res, next) => {
        let { statusCode = 500, message = "Something went wrong" } = err;
        res.status(statusCode).render("listings/err.ejs", { message });
    });
   
    // app.use((err, req, res, next) => {
    //     let { statusCode = 500, message = "Something went wrong" } = err;
    //     res.status(statusCode).render("listings/err.ejs", { message });
    // });
    
    
// });





app.listen(8080,()=>{
    console.log("server is start")
});