const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ttptxjd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const tech_bond = client.db('tech_bond')
    const allProducts = tech_bond.collection('allProducts')
    const userCart = tech_bond.collection('userCart')
    const userInfo = tech_bond.collection('userInfo')

    app.get('/userinfo', async (req, res) => {
      const cursor = userInfo.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/userinfo', async (req, res) => {
      const info = req.body
      const result = await userInfo.insertOne(info)
      res.send(result)
      console.log(result)
    })


    app.get('/usercart', async (req, res) => {
      const cursor = userCart.find()
      const result = await cursor.toArray()
      res.send(result)
    })


    app.post('/usercart', async (req, res) => {
      const productInfo = req.body
      const result = await userCart.insertOne(productInfo)
      res.send(result)
      console.log(result)
    })



    // app.delete('/usercart/:id',async(req,res)=>{
    //   const id = req.params.id
    //   const query = {_id: new ObjectId(id)}
    //   const result = await userCart.deleteOne(query)
    //   res.send(result)
    //   console.log(result)
    // })

    // Updated API route with error handling
    app.delete('/usercart/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await userCart.deleteOne(query);

        if (result.deletedCount > 0) {
          console.log("Successfully deleted");
          res.status(200).json({ message: "Item successfully deleted" });
        } else {
          console.log("Item not found");
          res.status(404).json({ message: "Item not found" });
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get('/allproducts', async (req, res) => {
      const cursor = allProducts.find()
      const result = await cursor.toArray()
      res.send(result)
    })


    app.post('/allproducts', async (req, res) => {
      const productInfo = req.body
      const result = await allProducts.insertOne(productInfo)
      res.send(result)
      console.log(result)
    })

    app.put('/allproducts/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upset: true }
      const updatedProductInfo = req.body
      const productInfo = {
        $set: {
          image: updatedProductInfo.image,
          name: updatedProductInfo.name,
          brandName: updatedProductInfo.brandName,
          type: updatedProductInfo.type,
          price: updatedProductInfo.price,
          description: updatedProductInfo.description,
          rating: updatedProductInfo.rating

        }
      }
      const result = await allProducts.updateOne(filter, productInfo, options)
      res.send(result)


    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


















app.get('/', (req, res) => {
  res.send("this is server main page")
})

app.listen(port, () => {
  console.log(`server is running on ${port}`)
})

