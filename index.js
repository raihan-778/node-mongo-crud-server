const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

/*
 mongodb user and password
---------####---------
userName: dbuser1;
password:tqTC9G9f6eN3JsiC 
*/

app.get("/", (req, res) => {
  res.send("Hello from node-mongodb crud server");
});

app.listen(port, () => {
  console.log(`node-mongo server is running form port ${port}`);
});

const uri =
  "mongodb+srv://dbuser1:tqTC9G9f6eN3JsiC@cluster0.jz1qjld.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const userCollection = client.db("nodeMongoCrud").collection("users");
    //get method for show data to UI from database
    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    //post method
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //update user
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    //put method

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
      console.log(user);
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          name: user.name,
          address: user.Address,
          email: user.email,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });

    //delete method

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("trying to delet ,", id);
      const query = { _id: ObjectId(id) };

      const result = await userCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));
