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
app.get("/",(req,res)=>{
    res.send("BISMILLAH")
});
// create
app.post("/products", async (req,res)=>{
    try{
        const newProduct = new Product({

            title:req.body.title,
            price:req.body.price,
            description:req.body.description,
        })
        const productData= await newProduct.save();
        

        res.status(201).send(productData);
    }catch(error){
        res.status(500).send({message: error.message})
    }
})

app.get("/products",async (req,res) =>{
    try {
        const products = await Product.find({price:{$lte:300}});
        // const products = await Product.find().limit(2);
        if(products){
            // res.status(200).send(products)
            res.status(200).send({
                success:true,
                mmessage:"return single products",
                data: product
            })
        }
        else{
            // res.status(404).send({
            //     message: "products not found"
            // })
            res.status(404).send({
                success:false,
                message: "products not found"
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.get("/products/:id",async (req,res) =>{
    try {
        const id=req.params.id;
        const product = await Product.findOne({_id: id});
        // const product = await Product.findOne({_id: id},{title:1, _id:0});
        // const product = await Product.findOne({_id: id}).select
        // ({title:1, _id:0});
        // const products = await Product.find().limit(2);
        if(product){
            // res.status(200).send(product)
            res.status(200).send({
                success:true,
                mmessage:"return single product",
                data: product
            })
        }
        else{
            res.status(404).send({
                success:false,
                message: "product not found"
            })
        }
        res.send(product);
    } catch (error) {
        res.statusCode(500).send({ message: error.message });
    }
})

app.listen(port, async ()=>{
    console.log(`server is running at http://localhost:${port}`);
    await connectDB();
})

// DATABASE -> collections (table) -> document (record / row)

// GET: /products -> Return all the products
// GET: /products/:id -> Return a specific products
// POST: /products ->create a product



