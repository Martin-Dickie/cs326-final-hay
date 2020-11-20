'use strict';
const express = require('express');
const app = express();
app.use(express.json()); // lets you handle JSON input
app.use(express.static('public')); // lets you serve the client files

let port = process.env.PORT;
if (port === null || port === "") {
    port = 8000;
}

// Assuming your secrets.json contains the following:
// Username = user
// {“password”: “mysupersecretpassword”}

let secrets;
let password;
if (!process.env.PASSWORD) {
    secrets = require('secrets.json');
    password = secrets.password;
} else {
	password = process.env.PASSWORD;
}

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://user:"+password+"@cluster0.bxhm7.mongodb.net/Haystation?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

app.get('/', (req, res) => {
    res.sendFile('/project.html');
});

app.get('/readUser', (req, res) => {
    // Key will be unique user name
    const k = req.query.name;
    // const v = {
    //     name: k,
    //     status: faker.lorem.sentence(),
    //     friends: [faker.name.findName(), faker.name.findName()]
    // };
    client.connect(err => {
        const collection = client.db("Haystation").collection("Users");
        if (err) {
            console.err(err);
        } else { 
            res.end(collection.find({
                name: k
            }));
        }
        client.close();
    });
});

app.get('/deleteUser', (req, res) => {
    const k = req.query.key;
    // Delete
    client.connect(err => {
        const collection = client.db("Haystation").collection("Users");
        if (err) {
            console.err(err);
        } else { 
            collection.deleteOne({name:k});
            res.end();
        }
        client.close();
    });
});

app.post('/createUser', (req, res) => {
    const v = req.body["value"];
    client.connect(err => {
        const collection = client.db("Haystation").collection("Users");
        if (err) {
            console.err(err);
        } else { 
            collection.insertOne(v);
            res.end();
        }
        client.close();
    });
});

app.post('/updateUser', (req, res) => {
    const k = req.body["key"];
    const v = req.body["value"];
    // Update user with name k to the info stored in v
    client.connect(err => {
        const collection = client.db("Haystation").collection("Users");
        if (err) {
            console.err(err);
        } else { 
            collection.findAndModify({
                query: { name: k },
                update: v,
                });
            res.end();
        }
        client.close();
    });
});

app.get('/readAllLobbies', (req, res) => {
    // TODO in Milestone 3
    client.connect(err => {
        const collection = client.db("Haystation").collection("Lobbies");
        if (err) {
            console.err(err);
        } else { 
            res.end(JSON.stringify(
                collection.find({}).toArray().sort((a, b) => b.score - a.score).filter((v, i) => i < 10)
            ));
        }
        client.close();
    });
});

app.get('/readLobby', (req, res) => {
    // Key will be the lobby name
    const k = req.query.key;
    // const v = {
    //     name: faker.lorem.word(),
    //     game: faker.commerce.productName(),
    //     status: 'in game',
    //     players: 2,
    //     maxplayers: 10,
    //     users: [faker.name.findName(), faker.name.findName()]
    // };
    client.connect(err => {
        const collection = client.db("Haystation").collection("Lobbies");
        if (err) {
            console.err(err);
        } else { 
            res.end(collection.find({
                name: k,
            }));
        }
        client.close();
    });
});

app.post('/createLobby', (req, res) => {
    const v = req.body["value"];
    client.connect(err => {
        const collection = client.db("Haystation").collection("Lobbies");
        if (err) {
            console.err(err);
        } else { 
            collection.insertOne(v);
            res.end();
        }
        client.close();
    });
});

app.post('/updateLobby', (req, res) => {
    const k = req.body["key"];
    const v = req.body["value"];
    client.connect(err => {
        const collection = client.db("Haystation").collection("Lobbies");
        if (err) {
            console.err(err);
        } else { 
            collection.findAndModify({
                query: { name: k },
                update: v,
                });
            res.end();
        }
        client.close();
    });
});

app.post('/deleteLobby', (req, res) => {
    const k = req.query.key;
    // Delete
    client.connect(err => {
        const collection = client.db("Haystation").collection("Lobbies");
        if (err) {
            console.err(err);
        } else { 
            collection.deleteOne({name:k});
            res.end();
        }
        client.close();
    });
});

app.get('*', (req, res) => {
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});