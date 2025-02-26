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
const session = require("express-session");
const flash = require("connect-flash");
const passport=require("passport");
const localStrategy = require("passport-local");
const User = require("./routes/user.js")







const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const uuserRouter = require("./routes/uuser.js");


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

const sesssionOptions = {
    secret :"mysupersecret",
    resave : false,
    saveUninitialized: true,
    cookie :{
        expires : Date.now() + 7 *24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly: true
    }
};

app.get("/", (req, res) => {
    res.send("ready")
})

app.use(session(sesssionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy (User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.deleted=req.flash("deleted");
    res.locals.currentUser = req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//        email : "user@gmail.com",
//        username : "Delta-Taushal" 
//     });

//     let registeredUser = await User.register(fakeUser,"PASSWORD");
//     res.send(registeredUser);
// })


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",uuserRouter);


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