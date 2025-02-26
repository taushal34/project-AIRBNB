const express = require("express");
const router = express.Router();
const User = require("./user.js");
const passport = require("passport");
const {saveredirectUrl} = require("./middleware.js");


router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
});

router.post("/signup", async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newuser = new User({ email, username });
        const registeredUser = await User.register(newuser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to wonderlust");
            res.redirect("/listings");
        });
       
       
    } catch (error) {
        console.error("Error during user registration:", error);
        req.flash("error", "This User Is Allready Exist. Please Try Again.");
        res.redirect("/signup");
    }
});

router.get("/login", (req, res) => {
    res.render("user/login.ejs");
});

router.post(
    
    saveredirectUrl,"/login",
    passport.authenticate('local',
        {failureRedirect : "/login",
        failureFlash : true
        }),
        async(req,res)=>{
            req.flash("success","welcome to your wonderlust account");
            let redirectUrl = res.locals.redirecturl || "/listings";
            res.redirect(redirectUrl);
})

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            console.error("Error during logout:",err); 
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
})
module.exports = router;