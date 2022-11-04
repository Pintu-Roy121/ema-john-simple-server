const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware...............
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("ema john server is running");
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.geiv5ao.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        const productCollection = client.db('emajohndb').collection('products');

        app.get('/products', async (req, res) => {

            const page = parseInt(req.query.page);
            const size = parseInt(req.query.pageSize);
            // console.log(page, size);

            const query = {};
            const cursor = productCollection.find(query);

            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();

            res.send({ count, products });

        })


        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            // console.log(ids);
            const objectIds = ids.map(id => ObjectId(id));
            // console.log(objectIds);
            const query = { _id: { $in: objectIds } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })



    }
    finally {

    }

}
run().catch(error => {
    console.log(error);
})





app.listen(port, () => {
    console.log(`ema john server is running on port ${port}`);
})


