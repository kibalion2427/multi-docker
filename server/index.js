const keys = require("./keys");

// EXPRESS APP SETUP
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyparser.json());

//POSTGRES CLIENT SETUP
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on("error", () => {
  console.log("Lost PG connection");
});

pgClient.on("connect", () => {
  pgClient
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.log(err));
});

//REDIS CLIENT SETUP

const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

//EXPRESS ROUTE HANDLERS

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  //retrieve all from postgres
  const values = await pgClient.query("SELECT * FROM VALUES");
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  //retrieve all from redis
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  //insert a new value in redis and postgres
  const idx = req.body.index;
  if (parseInt(idx) > 40) {
    res.status(422).send("Index to high");
  }
  redisClient.hset("values", idx, "Nothing yet!"); //set a key
  redisPublisher.publish("insert", idx); //send an event for worker to calculate the fib value
  pgClient.query("INSERT INTO values(number) VALUES($1)", [idx]);

  res.send({ working: true });
});

app.listen(5000, () => {
  console.log("Fibonnacci server listening on port 5000");
});

// rm -r .git
