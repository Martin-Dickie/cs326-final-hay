# Database Documentation
The database uses mongodb configured in a cluster on altas. For each browser session the user "user" specified under atlas securely logs in (as specified in the docs using the PASSWORD environemnt variable set to a long secure password) and is able to perform all 9 API endpoints. (CHANGE THIS NUMBER WHEN YOU ADD YOUR ENDPOINTS). The structure of the database is in four collections: Lobbies, Users, Games, and Leaderboards, and these collections are specified as follows:
    - Lobbies: Collection of documents with the following attributes:
        - name: Name of Lobby
        - game: Name of Game the users are playing
        - status: ex: "Waiting for more players...", "In game", etc.
        - players: Number of players in the lobby at the moment
        - maxplayers: maxmimum number of players allowed in the game
        - users: List of the id's and names of users in this lobby
    - Users: ..........
        - name: Username of user
        - status: Custom string set by user. ex: "Looking for lobby", "In game", etc.
    - Leaderboards:
        - (more stuff here)
    - Games:
        - (more stuff here)

# Division of Labor breakdown:

## Martin:
-(your stuff here) (Game genre search?)

## Shivangi:
-(your stuff here) (Leaderboards?)

## Anthony:
-Skeleton API functions using Express and Faker
    - Includes 9 skelton API endpoints (CRUD for users, CRUD for lobbies, and an extra endpoint for fetching all lobbies)
-Front-end interface and DOM surgery code for the lobbies/friends page