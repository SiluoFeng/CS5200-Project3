const { MongoClient } = require("mongodb");

async function getAddresses(query, page, pageSize) {
  let db, client;

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const eventsCollection = db.collection("addresses");

    return await eventsCollection.find(query).sort({ _id: -1 }).toArray();
  } finally {
    await client.close();
  }
}

async function getAddressesCount(query) {
  let db, client;

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const eventsCollection = db.collection("addresses");

    return await eventsCollection.find(query).count();
  } finally {
    await client.close();
  }
}

module.exports.getAddresses = getAddresses;
module.exports.getAddressesCount = getAddressesCount;
