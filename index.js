const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v4o1ppd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      console.log("DB CONNECTED");

      const userCollection = client.db('luxury').collection('user');


      app.put('/user/:email', async(req, res) =>{
          const email = req.params.email;
          const user = req.body;
          const filter = {email: email};
          const options = {upsert: true};

          const updateDoc = {
              $set : user,
          }

          console.log(user);

          const result = await userCollection.updateOne(filter, updateDoc, options);

          const token = jwt.sign({email: email}, process.env.ACCESS_TOKEN, {expiresIn: '1hr'});

          res.send({ result, token }); 

      })

      
    } finally {
      /* await client.close();
     */
    }
  }
  run().catch(console.dir);
  app.get('/', (req, res) => {
    res.send('running LUXURY Backend')
});

app.listen(port, () => {
    console.log('LUXURY server running');
});
