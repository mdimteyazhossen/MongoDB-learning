const express= require("express");
const mongoose = require('mongoose');
const app=express();
const port=3002;

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