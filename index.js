const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require ('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;



// middleware

app.use(cors());
app.use(express.json());

// console.log(process.env.DB_PASS);


// connect to client server 





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ev00748.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    
    // use server data/ read server
    const servicesCollection = client.db('repair-zone').collection('services');
    const bookServicesCollection = client.db('repair-zone').collection('bookServices');
    const addServicesCollection = client.db('repair-zone').collection('addServices');
   
    //data read form server
    app.get('/services', async(req, res) => {
    const cursor = servicesCollection.find();
    const result = await cursor.toArray();
    res.send(result);
    });
    
    // all services read form server
    app.get('/addServices', async(req, res) => {
    const cursor = addServicesCollection.find();
    const result = await cursor.toArray();
    res.send(result);
    });
    
    //check out data
    
    app.get('/services/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    // const options ={
    // projection: {title: 1, price: 1, service_id: 1, img: 1}
    // }
    const result = await servicesCollection.findOne(query);
    res.send(result);
    });
    
    
    // add service data send to server
    
    app.post('/services', async(req, res) => {
      const newAddService  = req.body;
      console.log(newAddService );
      const result = await addServicesCollection.insertOne(newAddService );
      res.send(result)
      
      })
      
    
    //  booking information send request to server
    
    app.post('/booking', async(req, res) => {
    const booking = req.body;
    console.log(booking);
    const result = await bookServicesCollection.insertOne(booking);
    res.send(result)
    
    })
    
    // booking data read from server
    app.get('/booking', async(req, res) => {
    let query = {};
    if(req.query.email){
    query ={email: req.query.email}
    }
    const result = await bookServicesCollection.find(query).toArray();
    res.send(result);
    });
    
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





// for server testing   purposes

app.get('/', (req, res) => {
    res.send('doctor is running')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})