const { create } = require("domain");
const express= require("express");
const mongoose = require('mongoose');
const { title } = require("process");
const app=express();
const port=3002;

// create product schema
const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    createdAt: {
        type:Date,
        default: Date.now
    }

})
// create product model
const Product=mongoose.model("Products",productSchema);


const connectDB = async  () =>{
 try{
    await mongoose.connect('mongodb://127.0.0.1:27017/testProductDB');
    console.log("db is connected");
 }catch (error) {
    console.log("db is not connected");
    console.log(error.message);
    process.exit(1);
 }
}
// mongoose.connect('mongodb://127.0.0.1:27017/testProductDB')
// .then(()=> console.log("db is connected"))
// .catch((error)=>{
//     console.log("db is not conected");
//     console.log(error);
//     process.exit(1);
// });
app.get("/",(req,res)=>{
    res.send("BISMILLAH")
})
app.listen(port, async ()=>{
    console.log(`server is running at http://localhost:${port}`);
    await connectDB();
})

// DATABASE -> collections (table) -> document (record / row)