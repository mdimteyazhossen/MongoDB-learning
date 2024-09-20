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
        required:[true,"product title is required"],
        minlength:[3,"minimum length of the product title should be 3 "],
        maxlength:[10,"maximum length of the product title should be 10"],
        trim: true,//.....iphone15.....
        enum:{
            values: ["iphone18","samsung"],
            message: "{VALUE} is not supported",
        }
    },
    // price: Number,
    price:{
        type:Number,
        min:200,
        max:[2000,"maximum price should be 2000"],
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        unique: true,
    },
    // description: String,
    description:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:[true,"Phone number is required"],
        validate:{
            validator: function(v){
                // return /\d{3}-\d{3}-\d{4}/.test(v)
                  const phoneRegex = /\d{3}-\d{3}-\d{4}/;
                return phoneRegex.test(v);
            },
            message:(props)=> `${props.value} is not a valid phone number`
        }
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
            rating:req.body.rating,
            description:req.body.description,
            phone: req.body.phone,
        })
        const productData= await newProduct.save();
        

        res.status(201).send(productData);
    }catch(error){
        res.status(500).send({message: error.message})
    }
})

app.get("/products",async (req,res) =>{
    try {
        const price=req.query.price;
        const rating=req.query.rating;
        let products;
        // const products = await Product.find({price:{$lte:300}});
        // const products = await Product.find().limit(2);
        if(price && rating){
            // res.status(200).send(products)
            // res.status(200).send({
            //     success:true,
            //     mmessage:"return single products",
            //     data: product
            // })
            // products =await Product.find({$and:[{price: {$gt:500}},{rating:{$gt:4}}]}).countDocuments();
            // products =await Product.find({$and:[{price: {$gt:500}},{rating:{$gt:4}}]}).sort({price:1});
            products =await Product.find({$and:[{price: {$gt:500}},{rating:{$gt:4}}]}).sort({price:1}).select({title:1});
        }
        else{
            // res.status(404).send({
            //     message: "products not found"
            // })
            products =await Product.find().sort({price:-1}).select({title:1});
            // products =await Product.find().sort({price:-1});
            // products =await Product.find().countDocuments();
        }
        res.send(products)
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

app.delete("/products/:id", async (req,res)=>{
    try {
        const id = req.params.id;
        const product = await Product.deleteOne({_id:id})
        if(product){
            // res.status(200).send(product)
            res.status(200).send({
                success:true,
                mmessage:"delete single product",
                data: product
            })
        }
        else{
            res.status(404).send({
                success:false,
                message: "product not found"
            })
        }
    } catch (error) {
        res.statusCode(500).send({ message: error.message });
    }
})
app.put("/products/:id",async(req,res)=>{
    try {
        const id=req.params.id;
        // const updatedProduct = await Product.updateOne({_id:id},{
        const updatedProduct = await Product.findByIdAndUpdate(
            {_id:id},
            {
                $set:{
                    title:req.body.title,
                    price:req.body.price,
                    description:req.body.description,
                    rating:req.body.rating
                },
            },
            {new:true}
        )
        if(updatedProduct){
            // res.status(200).send(product)
            res.status(200).send({
                success:true,
                mmessage:"updated single product",
                data: updatedProduct
            })
        }
        else{
            res.status(404).send({
                success:false,
                message: "product not found"
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
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



