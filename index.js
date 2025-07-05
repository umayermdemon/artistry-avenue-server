const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cookieParser = require('cookie-parser')
const cors = require("cors");
const app = express();
const port = process.env.port || 5000;

//middleWare
app.use(cors())
app.use(express.json());
// app.use(cookieParser())

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.2fsgp3y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftCollection = client.db("craftDB").collection("craft");


    // auth related api

    // app.post('/jwt', async(req,res)=>{
    //   const user=req.body;
    //   console.log(user)
    //   const token=jwt.sign(user, process.env.Access_Token_secret,{ expiresIn: '1h' })
    //   res
    //   .cookie('token',token,{
    //     httpOnly:true,
    //     secure:false,
    //     sameSite:"none"
    //   })
    //   .send({success:true})
    // })



    // crafts related api

    app.get("/crafts", async (req, res) => {
      const cursor = craftCollection.find();
      // console.log(req.cookies.token)
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    app.post("/crafts", async (req, res) => {
      const newCraft = req.body;
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    });

    app.put("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const craft = req.body;
      console.log(craft)
      const updateCraft = {
        $set: {
          itemName: craft.itemName,
          subCategory: craft.subCategory,
          price: craft.price,
          customization: craft.customization,
          description: craft.description,
          image: craft.image,
          processingTime: craft.processingTime,
          rating: craft.rating,
          stockStatus:craft.stockStatus
        },
      };
      const result= await craftCollection.updateOne(filter,updateCraft,options)
      res.send(result);
    });
    app.delete("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This is Artistry Avenue server site");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
