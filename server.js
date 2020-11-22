'use strict';
const express = require('express');
const app = express();
app.use(express.json()); // lets you handle JSON input
app.use(express.static(__dirname + '/')); // lets you serve the client files

let port = process.env.PORT;
if (port === null || port === "" || !port) {
    port = 8000;
}
console.log(port);

// Assuming your secrets.json contains the following:
// Username = user
// {“password”: “mysupersecretpassword”}

let secrets;
let password;
if (!process.env.PASSWORD) {
    secrets = require('./secrets.json');
    password = secrets.password;
} else {
	password = process.env.PASSWORD;
}

const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://user:"+password+"@cluster0.bxhm7.mongodb.net/HayStation?retryWrites=true&w=majority";
const uri = "mongodb+srv://user:"+password+"@cluster0.bxhm7.mongodb.net/HayStation?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

app.get('/', (req, res) => {
    res.sendFile('./lobbies.html', { root: '.' });
});

app.get('/readUser', async (req, res) => {
    // Key will be unique user name
    const k = req.query.name;
    res.send(JSON.stringify(
        await client.db("Haystation").collection("Users").find({"name": k}).toArray()
    ));
});

app.get('/deleteUser', async (req, res) => {
    const k = req.query.key;
    // Delete
    await client.db("Haystation").collection("Users").deleteOne({"name":k});
    res.end();
});

app.post('/createUser', async (req, res) => {
    const v = req.body["value"];
    await client.db("Haystation").collection("Users").insertOne(v);
    res.end();
});

app.post('/updateUser', async (req, res) => {
    const k = req.body["key"];
    const v = req.body["value"];
    // Update user with name k to the info stored in v
    await client.db("Haystation").collection("Users").findAndModify({
        query: { "name": k },
        update: v,
    });
    res.end();
});

app.get('/readAllLobbies', async (req, res) => {
    res.send(JSON.stringify(
        await client.db("Haystation").collection("Lobbies").find().sort({ maxplayers: -1 }).limit(10).toArray()
    ));
    
});

app.get('/readLobby', async (req, res) => {
    // Key will be the lobby name
    const k = req.query.key;
    res.send(JSON.stringify(
        await client.db("Haystation").collection("Lobbies").find({"name": k}).toArray()
    ));
});

app.post('/createLobby', async (req, res) => {
    const v = req.body["value"];
    await client.db("Haystation").collection("Lobbies").insertOne(v);
    res.end();
});

app.post('/updateLobby', async (req, res) => {
    const k = req.body["key"];
    const v = req.body["value"];
    await client.db("Haystation").collection("Lobbies").findAndModify({
        query: { "name": k },
        update: v,
    });
    res.end();
});

app.post('/deleteLobby', async (req, res) => {
    const k = req.query.key;
    await client.db("Haystation").collection("Lobbies").deleteOne({"name":k});
    res.end();
});

app.get('*', (req, res) => {
});

client.connect(err => {
    if (err) {
        console.error(err);
    } else {
        app.listen(process.env.PORT || 8000);
    }
});