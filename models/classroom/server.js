const express = require("express");
const app = express();

app.get("/",(req,res)=>{
    res.send("hi, i am root route");
});

//users
// index-user
app.get("/users",(req,res)=>{
    res.send("GET for users")
});

//Show-user
app.get("/users/:id",(req,res)=>{
    res.send("GET id for show users")
});

//POST-user
app.post("/users",(req,res)=>{
    res.send("POST for users")
})

// DELETE-user
app.delete("/users/:id",(req,res)=>{
    res.send("DELETE for users")
})

//posts
// index-posts
app.get("/posts",(req,res)=>{
    res.send("GET for posts")
});

//Show-posts
app.get("/posts/:id",(req,res)=>{
    res.send("GET id for show posts")
});

//POST-posts
app.post("/posts",(req,res)=>{
    res.send("POST for posts")
})

// DELETE-posts 
app.delete("/posts/:id",(req,res)=>{
    res.send("DELETE for posts")
})

app.listen(3000,()=>{
    console.log("app is listning to port 3000")
})