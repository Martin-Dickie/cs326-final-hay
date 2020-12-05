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
There are three URL routes specified in the server.js file. "/" directs to games.html to be the default page for the site, and the two buttons "Games" and "Lobbies" link to games.html and lobbies.html, respectively.  

#### **Authentication/Authorization:**
Users are Authenticated by their username, entered through a window prompt as shown in the video. There is a validation function that checks to see if this is a user already in the database, and if not will prompt the user for a status and make their account (database entry). There are no special permissions for any particular users, and the users are able to log back with ease using the browser local storage, or by entering their username if prompted again (if the storage is cleared).

#### **Division of Labor:**
* Anthony: all work with the "lobbies" HTML, JS, and initial CSS file. Programmed all the website backend, and the database setup/logic.
* Martin: all work with the "games" HTML, JS, and initial CSS files. 
* Shivangi: CSS wizard, revised the two CSS files to include the word-art title and the colored buttons

#### **Conclusion:**
We had a lot of fun in the initial phases of the project and had a lot of great ideas for how we wanted the website to turn out. Unfortunately those goals were a bit too much (in hindsight they were obviously too much for an intro to web programming class), and we settled on more baseline functionality for the app using the big topics and technologies we discussed in class. We realized this mostly after milestone 1 when we got to the implementation phase and the goal of having a full chat and leaderboard system seemed farther away. From there, we settled on having three main functionalities: a games list, a lobby browser, and friends. These achieve the main goal of the app -- to provide a convienient way to organize multiplayer games with your friends -- without the lofty goals we previously had in mind. There were a lot of technical difficulties to overcome along the way, for example, using git with multiple people was difficult at times when the "auto-merge" feature would start (like during a specific pull) and cause a lot of errors in the next push as well as in VS Code's git integration that we didn't fully understand. In addition, the DOM manipulation in the lobbies.html page took a lot of difficult work to get working as intended and display every entry correctly. There's no particular topic or bit of information that we didn't know that we wish we would've known, but we do wish we could've gotten more practice with MongoDB setup.
