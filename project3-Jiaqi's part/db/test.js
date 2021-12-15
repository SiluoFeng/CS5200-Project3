const { createClient } = require("redis");
const { v4: uuidv4 } = require('uuid')
var global_id = 1500;

async function getLeaderBoard() {
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
    await redis_client.HSET(id, "street1", "s1")
    await redis_client.HSET(id, "street2", "s2")
    await redis_client.HSET(id, "city", "city")
    await redis_client.HSET(id, "zipCode", "89898")
    var result = await redis_client.HGETALL(id)

    console.log(result)


  } finally {
    await redis_client.quit();
  }
}

getLeaderBoard();