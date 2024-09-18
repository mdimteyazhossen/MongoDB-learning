const { create } = require("domain");
const express= require("express");
const mongoose = require('mongoose');
const { title } = require("process");
const app=express();
const port=3002;
app.use(express.json())
app.use(express.urlencoded({extended: true}));
// create product schema
const productSchema = new mongoose.Schema({
    // title: String,
    title:{
        type :String,
        required:true
    },
    // price: Number,
    price:{
        type:Number,
        required:true
    },
    // description: String,
    description:{
        type:String,
        required:true
    },
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
});
app.post("/products", async (req,res)=>{
    try{
        // get data from request body
        // const title =req.body.title;
        // const price= req.body.price;
        // const description=req.body.description; 
        // const newProduct = new Product({
        //     // title:title,
        //     // price:price,
        //     // desccription:description,

        //     title:req.body.title,
        //     price:req.body.price,
        //     description:req.body.description,

        //     // title,
        //     // price,
        //     // description,
        // })
        // const productData= await newProduct.save();
        const productData = await Product.insertMany([
            {
                title: "iphone 5",
                price: 70,
                description:"beautiful phone"
            },
            {
                title: "iphone 4",
                price: 20,
                description:"beautiful phone"
            }
        ]);

        res.status(201).send(productData);
    }catch(error){
        res.status(500).send({message: error.message})
    }
})
app.listen(port, async ()=>{
    console.log(`server is running at http://localhost:${port}`);
    await connectDB();
})

// DATABASE -> collections (table) -> document (record / row)