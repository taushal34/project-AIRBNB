const mongoose = require("mongoose");
const initdata= require("./data.js");
const listing2 = require("../models/listing.js");
const { object } = require("joi");



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

const initDB = async()=>{
    await listing2.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj , owner:"67bbfca1868ca46879b264bb"}));
    await listing2.insertMany(initdata.data);
    console.log("data was initiaslize");

}
initDB();