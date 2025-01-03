const express = require("express")
const app = express();
const mongoose = require("mongoose");
// const listing = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override")
const ejsMate = require("ejs-mate")
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema } = require("./scema.js");
// const Review = require("./models/review.js");
// const Listing = require("./models/listing.js");


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
// const review = require("./models/review.js");

let mongo_url = "mongodb://127.0.0.1:27017/wonderlust"

main()
    .then(() => {
        console.log("conected to DB")
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongo_url)

}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



app.get("/", (req, res) => {
    res.send("ready")
})


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


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





app.listen(8080, () => {
    console.log("server is start")
});