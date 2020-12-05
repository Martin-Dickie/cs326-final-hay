'use strict';
const express = require('express');
const app = express();
app.use(express.json()); // lets you handle JSON input
app.use(express.static(__dirname + '/')); // lets you serve the client files

let port = process.env.PORT;
if (port === null || port === '' || !port) {
    port = 8000;
}

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
// const uri = 'mongodb+srv://user:'+password+'@cluster0.bxhm7.mongodb.net/HayStation?retryWrites=true&w=majority';
const uri = 'mongodb+srv://user:'+password+'@cluster0.bxhm7.mongodb.net/HayStation?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });

app.get('/', (req, res) => {
    res.sendFile('./games.html', { root: '.' });
});

app.get('/games',(req,res) => {
    res.sendFile('./games.html', {root: '.'});
});

app.get('/lobbies', (req, res) => {
    res.sendFile('./lobbies.html', { root: '.' });
});

app.get('/readUser', async (req, res) => {
    // Key will be unique user name
    res.send(JSON.stringify(
        await client.db('Haystation').collection('Users').find({'name': req.query.name}).toArray()
    ));
});

app.get('/deleteUser', async (req, res) => {
    // Delete
    await client.db('Haystation').collection('Users').deleteOne({'name':req.query.name});
    res.end();
});

app.get('/favicon.ico',async (req,res) => {
    res.sendFile('./favicon.ico', {root: '.'});
});

app.post('/createUser', async (req, res) => {
    await client.db('Haystation').collection('Users').insertOne(req.body);
    res.end();
});

app.post('/updateUser', async (req, res) => {
    console.log(req.body);
    await client.db('Haystation').collection('Users').deleteOne({'name':req.body.name});
    await client.db('Haystation').collection('Users').insertOne(req.body);
    res.end();
});

app.get('/readAllLobbies', async (req, res) => {
    res.send(JSON.stringify(
        await client.db('Haystation').collection('Lobbies').find().sort({ maxplayers: -1 }).limit(10).toArray()
    ));
    
});

app.get('/readLobby', async (req, res) => {
    // Key will be the lobby name
    res.send(JSON.stringify(
        await client.db('Haystation').collection('Lobbies').find({'name': req.query.key}).toArray()
    ));
});

app.post('/createLobby', async (req, res) => {
    await client.db('Haystation').collection('Lobbies').insertOne(req.body);
    res.end();
});

/*
*   Lobby: {
        name,
        game,
        message,
        players,
        maxplayers,
        users,
    }
*/
app.post('/updateLobby', async (req, res) => {
    console.log(req.body);
    await client.db('Haystation').collection('Lobbies').deleteOne({'name':req.body.name});
    await client.db('Haystation').collection('Lobbies').insertOne(req.body);
    res.end();
});

app.post('/deleteLobby', async (req, res) => {
    await client.db('Haystation').collection('Lobbies').deleteOne({'name':req.query.name});
    res.end();
});


app.get('/readAllGames', async (req, res) => {
    res.send(JSON.stringify(
        await client.db('Haystation').collection('Games').find().toArray()
    ));
});

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