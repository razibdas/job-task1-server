const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;


// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jgjgvfa.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        // Send a ping to confirm a successful connection

        const jobCollection = client.db('task').collection('jobTasks');


        app.post('/jobTasks', async (req, res) => {
            const taskadd = req.body;
            const data = {
                title: taskadd.title,
                description: taskadd.description,
                date: taskadd.date,
                priority: taskadd.priority,
                status: 'todo',
            };
            const result = await jobCollection.insertOne(data);
            res.send(result);
        });

        app.get('/jobTasks', async (req, res) => {
            const result = await jobCollection.find().toArray()
            res.send(result)
        })

        app.patch('/jobTasks', async (req, res) => {
            const id = req.query.id;
            const data = req.body;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: data.status,
                },
            };
            const result = await jobCollection.updateOne(query, updatedDoc);
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('job task is running')
})

app.listen(port, () => {
    console.log(`job task is running on port ${port}`);
})