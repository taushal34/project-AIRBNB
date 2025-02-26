const express = require("express");
const app = express();
const session = require("express-session");
const flash= require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"models", "views"));
console.log("Views directory path:", path.join(__dirname,"models", "views"));


const sessionOption = 
        {  
         secret: "amarosecret",
         resave: false,
          saveUninitialized: true 
        }

app.use(session(sessionOption));
app.use(flash());

app.get("/register",(req,res)=>{
    let { name = "anonymous" }= req.query;
    req.session.name= name;
    if(name === "anonymous"){
        req.flash("error","user not regestired");
    }else{
        req.flash("success","user registred successfully!");
    }
    console.log(req.session.name);
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.render("page.ejs",{name: req.session.name});
})



// app.get("/reqcount",(req,res)=>{

//     if( req.session.count){
//         req.session.count++
//     }else( req.session.count=1);

//     res.send(`you sent request to ${req.session.count} times`);
// })
// app.get("/test", (req, res) => {
//     res.send("test successful");
// });

app.listen(3000, () => {
    console.log("App is listening on port 3000");
});
