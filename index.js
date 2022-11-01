const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, MongoRuntimeError } = require('mongodb');
 
 
//use middleware
 
app.use(cors());
app.use(express.json());
 
 
// uri = pass and user name from .env file
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nfgmjj6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// console.log(client);
 async function run(){
    try{
        await client.connect();
        // console.log("Database Connected");
        const servicesCollection = client.db('doctors_portal').collection('services');

        app.get('/service',async(req,res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

    }
    finally{

    }

}
run().catch(console.dir);
 
app.get('/', (req, res) => {
    res.send('Running doctors Server');
});
 
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});