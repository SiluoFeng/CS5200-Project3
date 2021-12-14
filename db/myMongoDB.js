const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
const DB_NAME = "project2";
const COL_NAME = "events";

async function getEvents(query, page, pageSize) {
  console.log("getEvents", query);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      eventName: { $regex: `^${query}`, $options: "i" },
    };

    return await client
      .db(DB_NAME)
      .collection(COL_NAME)
      .find(queryObj)
      .sort({ _id: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .toArray();
  } finally {
    client.close();
  }
}

async function getEventsCount(query) {
  console.log("getEventsCount", query);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      eventName: { $regex: `^${query}`, $options: "i" },
    };

    return await client.db(DB_NAME).collection(COL_NAME).find(queryObj).count();
  } finally {
    client.close();
  }
}

async function getParticipants(query) {
  console.log("getParticipants", query);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      eventName: { $regex: `^${query}`, $options: "i" },

    };

    return await client.db(DB_NAME).collection(COL_NAME).find(queryObj)
                        .sort({participantActual:-1}).limit(10).toArray();
  } finally {
    client.close();
  }
}

async function getEventByID(_id) {
  console.log("getEventByID", _id);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      // _id: new ObjectId(_id),
      _id:_id,
    };

    return await client.db(DB_NAME).collection(COL_NAME).findOne(queryObj);
  } finally {
    client.close();
  }
}

async function updateEventByID(_id, eve) {
  console.log("updateEventByID", _id, eve);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      // _id: new ObjectId(_id),
      _id: _id,
    };

    // If tags is a string convert it to an array
    if (typeof eve.tags === "string") {
      eve.tags = eve.tags.split(",").map((t) => t.trim()); // removes whitespace
    }

    return await client
      .db(DB_NAME)
      .collection(COL_NAME)
      .updateOne(queryObj, { $set: eve });
  } finally {
    client.close();
  }
}

async function deleteEventByID(_id) {
  let db, client;
  console.log("passing ID:", typeof (_id));
  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const events = db.collection("events");

    query = {_id: ObjectId(_id),};

    return await events.deleteOne(query);
  } finally {
    await client.close();
  }}

async function insertEvent(eve) {
  let db, client;

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const events = db.collection("events");

    // MQL 👉 json
    const item = {
      eventName: eve.eventName,
      date: eve.date,
      description: eve.description,
      participantVolume: eve.participantVolume
    };

    console.log("Inserting item", item);
    return await events.insertOne(item);
  } finally {
    await client.close();
  }}



module.exports.getEvents = getEvents;
module.exports.getEventsCount = getEventsCount;
module.exports.insertEvent = insertEvent;
module.exports.getEventByID = getEventByID;
module.exports.updateEventByID = updateEventByID;
module.exports.deleteEventByID = deleteEventByID;
module.exports.getParticipants = getParticipants;

