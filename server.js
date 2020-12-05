'use strict';

// Express and port setup
const express = require('express');
const app = express();
app.use(express.json()); // lets you handle JSON input
app.use(express.static(__dirname + '/')); // lets you serve the client files

let port = process.env.PORT;
if (port === null || port === '' || !port) {
    port = 8000;
}

// Password determination for mongo login
let secrets;
let password;
if (!process.env.PASSWORD) {
    secrets = require('./secrets.json');
    password = secrets.password;
} else {
	password = process.env.PASSWORD;
}

// Mongo info!
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://user:'+password+'@cluster0.bxhm7.mongodb.net/HayStation?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });

// redirect to games.html
app.get('/', (req, res) => {
    res.sendFile('./games.html', { root: '.' });
});

// redirect to games.html
app.get('/games',(req,res) => {
    res.sendFile('./games.html', {root: '.'});
});

// redirect to lobbies.html
app.get('/lobbies', (req, res) => {
    res.sendFile('./lobbies.html', { root: '.' });
});

// Favicon handler
app.get('/favicon.ico',async (req,res) => {
    res.sendFile('./favicon.ico', {root: '.'});
});

// Reads and returns the json specifying the user with the specified name
app.get('/readUser', async (req, res) => {
    res.send(JSON.stringify(
        await client.db('Haystation').collection('Users').find({'name': req.query.name}).toArray()
    ));
});

// Deletes user specified
app.get('/deleteUser', async (req, res) => {
    await client.db('Haystation').collection('Users').deleteOne({'name':req.query.name});
    res.end();
});

// Creates no db entry for new user
app.post('/createUser', async (req, res) => {
    await client.db('Haystation').collection('Users').insertOne(req.body);
    res.end();
});

// Updates specified user with req.body info
app.post('/updateUser', async (req, res) => {
    console.log(req.body);
    await client.db('Haystation').collection('Users').deleteOne({'name':req.body.name});
    await client.db('Haystation').collection('Users').insertOne(req.body);
    res.end();
});

// Reads and returns json of entire "Lobbies" collection
app.get('/readAllLobbies', async (req, res) => {
    res.send(JSON.stringify(
        await client.db('Haystation').collection('Lobbies').find().sort({ maxplayers: -1 }).limit(10).toArray()
    ));
    
});

// Reads and returns the json specifying the lobby with the specified name
app.get('/readLobby', async (req, res) => {
    res.send(JSON.stringify(
        await client.db('Haystation').collection('Lobbies').find({'name': req.query.key}).toArray()
    ));
});

// Creates new lobby db entry with specified info
app.post('/createLobby', async (req, res) => {
    await client.db('Haystation').collection('Lobbies').insertOne(req.body);
    res.end();
});

// Updates specified lobby with req.body info
app.post('/updateLobby', async (req, res) => {
    console.log(req.body);
    await client.db('Haystation').collection('Lobbies').deleteOne({'name':req.body.name});
    await client.db('Haystation').collection('Lobbies').insertOne(req.body);
    res.end();
});

// Deletes specified lobby
app.post('/deleteLobby', async (req, res) => {
    await client.db('Haystation').collection('Lobbies').deleteOne({'name':req.query.name});
    res.end();
});

// Returns json of all games in database
app.get('/readAllGames', async (req, res) => {
    res.send(JSON.stringify(
        await client.db('Haystation').collection('Games').find().toArray()
    ));
});

// Baseline response for unhandled requests
app.get('*', (req, res) => {
    // Do nothing
});

  
client.connect(err => {
    if (err) {
        console.error(err);
    } else {
        app.listen(process.env.PORT || 8000);
    }
});