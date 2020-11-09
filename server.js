'use strict';
const express = require('express');
const faker = require('faker');
const app = express();
app.use(express.json()); // lets you handle JSON input
app.use(express.static('public')); // lets you serve the client files

const port = 3000;
let datastore = {}; // No Mongo yet, just placeholder so lint doesn't evicerate me
app.get('/', (req, res) => {
    res.sendFile('/project.html');
});

app.get('/readUser', (req, res) => {
    // Key will be unique user name
    const k = req.query.key;
    const v = {
        name: faker.name.findName(),
        status: faker.lorem.sentence(),
        friends: [faker.name.findName(), faker.name.findName()]
    };
    res.send(`key = ${k}, value = ${v}`);
});

app.get('/deleteUser', (req, res) => {
    const k = req.query.key;
    // Delete (milestone 3)
    res.send(`deleted user ${k}`);
});

app.post('/updateUser', (req, res) => {
    const k = req.body["key"];
    const v = req.body["value"];
    datastore['users'][k] = v;
    res.send('Set.');
});

app.get('/readLobby', (req, res) => {
    // Key will be the lobby name
    const k = req.query.key;
    const v = {
        name: faker.lorem.word(),
        game: faker.commerce.productName(),
        status: 'in game',
        players: 2,
        maxplayers: 10,
        users: [faker.name.findName(), faker.name.findName()]
    };
    res.send(`key = ${k}, value = ${v}`);
});

app.post('/updateLobby', (req, res) => {
    const k = req.body["key"];
    const v = req.body["value"];
    datastore['lobbies'][k] = v;
    res.send('Set.');
});

app.post('/deleteLobby', (req, res) => {
    const k = req.query.key;
    // Delete (milestone 3)
    res.send(`deleted user ${k}`);
});

app.get('*', (req, res) => {
    res.send('No such endpoint exists');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});