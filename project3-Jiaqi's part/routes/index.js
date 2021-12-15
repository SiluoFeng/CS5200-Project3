const express = require("express");
const { MongoClient } = require("mongodb");
const { createClient } = require("redis");
const { v4: uuidv4 } = require('uuid')
const router = express.Router();
var global_id = 2000;

//const myDB = require("../db/mongoIntializer.js");
async function getAddresses(query, page, pageSize) {
  let redis_client;

  try {
    redis_client = createClient();;
    redis_client.on("error", (err) => console.log("Redis Client Error", err));

    await redis_client.connect();
    console.log("redisconnected");
    let all_result= await redis_client.KEYS('*');
    let address = []
    for (let i = 0; i<all_result.length;i++){
        let result = await redis_client.HGETALL(all_result[i]);
        address.push(result)
    }
    return address;
  } finally {
    await redis_client.quit();
  }
}



async function getAddressByID(addressID) {
  let redis_client;

  try {
    //prepare mongo client and collection

    console.log("Connected to Mongo Server");

    //prepare redis client
    redis_client = createClient();

    redis_client.on("error", (err) => console.log("Redis Client Error", err));

    await redis_client.connect();
    console.log("redisconnected");

    //do the mongo query
    //await redis_client.set("favoritesSum", "0");

    return await redis_client.HGETALL(addressID);

  } finally {
    await redis_client.quit();
  }
}

async function updateAddressByID(addressID, par) {
  let redis_client;

  try {
    //prepare mongo client and collection
    console.log("Connected to Mongo Server");
    //prepare redis client
    redis_client = createClient();

    redis_client.on("error", (err) => console.log("Redis Client Error", err));

    await redis_client.connect();
    console.log("redisconnected");

    //do the mongo query
    //await redis_client.set("favoritesSum", "0");
    let result = await redis_client.HGETALL(addressID);
    await redis_client.HSET(addressID, "street1", `${par.street1}`)
    await redis_client.HSET(addressID, "street2", `${par.street2}`)
    await redis_client.HSET(addressID, "city", `${par.city}`)
    await redis_client.HSET(addressID, "zipCode", `${par.zipCode}`)
    //par.street1
    return await redis_client.HGETALL(addressID);
  } finally {
    await redis_client.quit();
  }
}


async function deleteAddressByID(query) {
  let redis_client;

  try {
    //prepare mongo client and collection

    console.log("Connected to Mongo Server");

    //prepare redis client
    redis_client = createClient();

    redis_client.on("error", (err) => console.log("Redis Client Error", err));

    await redis_client.connect();
    console.log("redisconnected");

    //do the mongo query
    //await redis_client.set("favoritesSum", "0");

    return await redis_client.DEL(query);
  } finally {
    await redis_client.quit();
  }
}


async function createAddress(add) {
  let redis_client;

  try {
    //prepare mongo client and collection

    console.log("Connected to Mongo Server");

    //prepare redis client
    redis_client = createClient();

    redis_client.on("error", (err) => console.log("Redis Client Error", err));

    await redis_client.connect();
    console.log("redisconnected");

    //do the mongo query
    //await redis_client.set("favoritesSum", "0");
    global_id += 1;
    let id = uuidv4();
    await redis_client.HSET(id, "_id", `${id}`)
    await redis_client.HSET(id, "id", `${global_id}`)
    await redis_client.HSET(id, "street1", `${add.street1}`)
    await redis_client.HSET(id, "street2", `${add.street2}`)
    await redis_client.HSET(id, "city", `${add.city}`)
    await redis_client.HSET(id, "zipCode", `${add.zipCode}`)
    return await redis_client.HGETALL(id)
  } finally {
    await redis_client.quit();
  }
}




/* GET home page. */

router.get("/addresses", async (req, res, next) => {
  const query = req.query.q || {};
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    
    let addresses = await getAddresses(query, page, pageSize);
    res.render("./pages/addresses", {
      addresses,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(0/pageSize),
    });
  } catch (err) {
    next(err);
  }
});



router.get("/addresses/:addressID/edit", async (req, res, next) => {
  const addressID = req.params.addressID;
  const query = req.query.q
  const msg = req.query.msg || null;

  
  try {

    let add = getAddressByID(addressID);

    console.log("edit addresses", {
      add,
      msg,
    });
    console.log("-----------", addressID);

    res.render("./pages/editAddress", {
      addressId: addressID,
      add: add,
      msg: msg,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/addresses/:addressID/edit", async (req, res, next) => {
  const addressID = req.params.addressID;
  const add = req.body;

  try {

    let updateResult = await updateAddressByID(addressID, add);
    console.log("update", updateResult);

    if (updateResult) {
      res.redirect("/addresses/?msg=Updated");
    } else {
      res.redirect("/addresses/?msg=Error Updating");
    }

  } catch (err) {
    next(err);
  }
});

router.get("/addresses/:addressID/delete", async (req, res, next) => {
  const addressID = req.params.addressID;
  console.log(addressID)
  const msg = req.query.msg || null;
  try {

    let deleteResult = await deleteAddressByID(addressID);

    console.log("delete addresses", {
      deleteResult,
      msg,
    });

    if (deleteResult ) {
      res.redirect("/addresses/?msg=Deleted");
    } else {
      res.redirect("/addresses/?msg=Error Deleting");
    }

  } catch (err) {
    next(err);
  }
});


router.post("/createAddress", async (req, res, next) => {
  const add = req.body;
  console.log("get request body");

  try {
    const insertAdd = await createAddress(add);

    console.log("Inserted", insertAdd);

    res.redirect("/addresses/?msg=Inserted");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

module.exports = router;