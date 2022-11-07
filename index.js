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
        const bookingCollection = client.db('doctors_portal').collection('bookings');

        app.get('/service',async(req,res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        /**
         * Api naming conversion :
         * 
         * app.get('/booking') //get all booking in this collection.or get more one or by filter.
         * app.get('/booking:id')//get a specific booking.
         * app.post('/booking:id') // add a new booking.
         * app.patch('/booking:id') // updating a booking.
         * app.patch('/booking:id') // Deleting a booking.
         * 
         * Moral of the Story :
         * when we write just 'booking' which means all booking collection here . 
         * when we write 'booking:id' which means one booking here.
         * 
         */

        app.post('/booking',async(req,res) =>{
            const booking = req.body;
            const query = {treatment: booking.treatment, date: booking.date, patient: booking.patient}
            const exists = await bookingCollection.findOne(query);
            if (exists) {
                return res.send({success: false, booking: exists})
            }
            const result = await bookingCollection.insertOne(booking);
            return res.send({success: true , result});
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