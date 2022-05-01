const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const { Pool } = require('pg');
const pgClient = new Pool({
    host : keys.pgHost,
    port : keys.pgPort,
    database : keys.pgDatabase,
    user : keys.pgUser,
    password : keys.pgPassword
});

pgClient.on("connect", (client) => {
    client
      .query("CREATE TABLE IF NOT EXISTS values (number INT)")
      .catch((err) => console.error(err));
  });

// redis client setup
const redis = require('redis');
const redisClient = redis.createClient({
    host : keys.redisHost,
    port : keys.redisPort,
    retry_strategy : () => 1000
});
const redisPublisher = redisClient.duplicate();

// Routing Handlers

app.get('/', (req, res) => {
   res.send('Hi !!!');
});

app.get('/values/all', async (req, res) => {
   const values = await pgClient.query('SELECT * FROM values');
   res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
   redisClient.hgetall('values', (err, values) => {
      res.send(values);
   });
});

app.post('/values', async (req, res) => {

    const n = req.body.index;

    if(parseInt(n) > 40){
        return res.status(422).send ('Number too high !!!');
    }
    redisClient.hset('values', n, 'nothing so far');
    redisClient.publish('insert', n);
    pgClient.query('INSERT INTO values(number) VALUES ($1)', [parseInt(n)]);

    res.send({ working : true });

});

app.listen(5000, err => {
   console.log('Listening !!!');
});