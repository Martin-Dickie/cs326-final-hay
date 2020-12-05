# **<div align="center">COMPSCI 326 FINAL PROJECT**

#### **Team Name:** hay

#### **Application Name:** HayStation

#### **Semester:** Fall 2020

#### **Overview:**  
  
It always feels amazing to play games with friends! Who doesn't love a small healthy competition, right?

We present to you, [**HayStation**](https://floating-plateau-01072.herokuapp.com/games).  

We have created a website for you and your gaming buddies where you can invite them to play various games with you. You can also add them as friends so it is easy connecting the next time. 

You can create an account on the website. We also offer the option to play with other  gamers on the internet. Making a new friend never hurts!

#### **Team Members:**

* [Martin Dickie](github.com/martin-dickie) :  martin-dickie

* [Shivangi Khanna](https://github.com/khannashivangi1):  khannashivangi1

* [Anthony Rinaldi](https://github.com/anttl462) : anttl462

#### **User Interface:**

#### **APIs:**
* /createUser, with the "name" and "status" parameters. This initializes a new user into the database with the specified name and status, and sets their initial friends list to an empty array.
* /readUser, with the "name" parameter. This is a GET request to return the user data from the database for the specified user.
* /updateUser, with the "user" parameter. This updates user specified in the body of the request, and replaces the data (other than name) with the data from the body.
* /deleteUser, with the "name" parameter. This deletes the specified user.
* /createLobby, with the "lobby" parameter. This initializes a new lobby into the database with the specified parameters from the request body (name, game, message, maxplayers), and sets their initial player count to 0 as well as their "users" array to an empty array (this will store the names of the users in the lobby)
* /readLobby, with the "name" parameter. This simply reads the lobby with the specified name and returns with the json object representing the lobby
* /readAllLobbies. This returns the entire collection of lobbies from the database
* /updateLobby, with the "lobby" paramater. Operates identically to the /updateUser endpoint by specifying a lobby object and replacing the lobby data in the database with that name with the lobby query
* /deleteLobby, with the "name" parameter. This deletes the specified lobby.
* /readAllGames. This reads and returns all documents from the "Games" collection in the database.

#### **Database:**
The database is a MongoDB with the main database "Haystation" containing three collections: "Games", "Lobbies", and "Users". The "Users" and "Lobbies" collection's documents are specified as follows:
```
user: {
  name: <string>,
  status: <string>,
  friends: Array[Object{name: <string>, status: <string>}]
}

lobby: {
  name: <string>,
  game: <string>,
  message: <string>,
  players: <integer>,
  maxplayers: <integer>,
  users: Array[<string>]
}
```
The goal with these collections is specify all the information a user would need to know about a lobby before joining the lobby, and establish a relationship between users, themselves, and lobbies using the "users" and "friends" parameters. Note that only the names of the users are specified in the lobby documents, but the names AND statuses of users are specified in the friends parameter.

The "Games" collection has documents populated from Steam's game data API, with one document per game.

#### **URL Routes/Mappings:**

#### **Authentication/Authorization:**

#### **Division of Labor:**

#### **Conclusion:**
