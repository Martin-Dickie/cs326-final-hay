'use strict';

const url = 'https://floating-plateau-01072.herokuapp.com';
// const url = 'http://localhost:8000';

let user = window.localStorage.getItem('username'); 
if (!user) {
    user = window.prompt('Sign in or Signup! Enter your username:');
    window.localStorage.setItem('username', user);
}

// Refactored "everything-function", ensures that validateUser finishes before the other functions
go();

async function go() {
    await validateUser(user);
    const lobby = await getCurrentLobby(user);
    if (lobby !== -1) {
        await getAndRenderCurrentLobby();
    }
    await getAndRenderFriendInfo();
    await getAndRenderLobbyInfo();
}

/*
*   Takes in a name string and looks in the database for this name. Returns [] (empty array) if not found, else returns the info for the user with this name
*/
async function validateUser(name) {
    const response = await getUserInfo(name);
    if (response.length === 0) {
        // New User
        const status = window.prompt('A new user! What\'s your current status? (This will display in friends lists)');
        await fetch(url + '/createUser', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                status: status,
                friends: []
            }),
            headers: { 
                'Content-type': 'application/json; charset=UTF-8'
            } 
        });
    } else {
        // else Returning User, userInfo will be fetched during rendering
        window.alert('Welcome Back ' + user + '!');
    }
    
}

// Global variable
let userInfo;

/*
*   Refactored function for getting the info on a user with name "name". Returns the JSON object representing the user
*/
async function getUserInfo(name) {
    const userInfoResponse = await fetch(url + '/readUser?name='+name, {
        method: 'GET',
        headers: { 
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
    if (userInfoResponse.ok) { 
        userInfo = await userInfoResponse.json();
        return userInfo;
    } else {
        alert('HTTP-Error: ' + userInfoResponse.status);
        return -1;
    }
}

/*
*   Action listener to prompt the user to create a lobby 
*/
document.getElementById('createLobby').addEventListener('click', async function () {
    // Get the info from the user
    const name = prompt('Name of Lobby?');
    const game = prompt('What Game Will you Be Playing?');
    const message = prompt('Message? (like a lobby code?)');
    const players = 0;
    const maxplayers = prompt('Maximum Number of Players?');

    const newGame = {
        name: name,
        game: game,
        message: message,
        players: players,
        maxplayers: maxplayers,
        users: []
    };
    // API call
    await fetch(url + '/createLobby', {
        method: 'POST',
        body: JSON.stringify(newGame), 
        headers: { 
            'Content-type': 'application/json; charset=UTF-8'
        } 
    });

    // Done
    window.alert('Lobby created! Click in the browser to join');
    await getAndRenderLobbyInfo();
});


/*
*   Action listener for leaving the current lobby
*/
document.getElementById('leaveLobby').addEventListener('click', async function () {
    // Confirm with the user
    if (confirm('Leave Lobby?')) {
        const allLobbyInfoResponse = await fetch(url + '/readAllLobbies', {
            method: 'GET',
            headers: { 
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
        if (allLobbyInfoResponse.ok) { 

            const lobby = await getCurrentLobby();
            // User actually isn't in a lobby, let them know!
            if(lobby === -1) {
                window.alert('You can\'t leave a lobby when you\'re not in one!');
                return;
            }
            // API call to update the lobby with new player count and user info
            await fetch(url + '/updateLobby', {
                method: 'POST',
                body: JSON.stringify(lobby), 
                headers: { 
                    'Content-type': 'application/json; charset=UTF-8'
                } 
            });

            window.alert('You have left the lobby!');
            document.getElementById('lobby-message').innerText='';
            await getAndRenderLobbyInfo();
            await getAndRenderCurrentLobby();
        }
    }
});

/*
*   Fetches and renders the user's friend list into the right box
*/
async function getAndRenderFriendInfo() {
    while (document.getElementById('friend-table-body').firstChild) {
        document.getElementById('friend-table-body').firstChild.remove();
    }
    // Update the userInfo global variable
    await getUserInfo(user);
    const friends = userInfo[0].friends;
    // If user has no friends, tell how to make them!
    if (friends.length === 0) {
        document.getElementById('friend-header').innerText = 'Join a Lobby and Click a User to add a friend';
    }
    for(let i = 0; i < friends.length; i++) {
        // Add friends to page one by one
        const newRow = document.createElement('tr');
        newRow.setAttribute('id', `${i}`);
        const idElement = document.createElement('th');
        idElement.setAttribute('scope', 'row');
        idElement.innerText = friends[i].name;
        const nameElement = document.createElement('td');
        nameElement.innerText = friends[i].name;
        const statusElement = document.createElement('td');
        statusElement.innerText = friends[i].status;

        nameElement.classList.add('hay-entry');
        newRow.appendChild(nameElement);
        newRow.appendChild(statusElement);

        // Action Listener for Removing Friend
        newRow.addEventListener('click', async function() {
            if (confirm('Remove '+ friends[i].name +' as Friend? '+newRow.id)) {
                const userInfo2 = await getUserInfo(user);
                userInfo2[0].friends.splice(parseInt(newRow.id), 1);
                await fetch(url + '/updateUser', {
                    method: 'POST',
                    body: JSON.stringify(userInfo2[0]), 
                    headers: { 
                        'Content-type': 'application/json; charset=UTF-8'
                    } 
                });
                // Re-render friends list:
                await getAndRenderFriendInfo();
            }
        });
        document.getElementById('friend-table-body').appendChild(newRow);
        
    }
}


/*
*   Fetches and renders the info from the current live lobbies into the middle box
*/
async function getAndRenderLobbyInfo() {
    while (document.getElementById('lobby-browser-table').firstChild) {
        document.getElementById('lobby-browser-table').firstChild.remove();
    }
    // Initial GET request
    const allLobbyInfoResponse = await fetch(url + '/readAllLobbies', {
        method: 'GET',
        headers: { 
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
    if (allLobbyInfoResponse.ok) { 
        const allLobbyInfo = await allLobbyInfoResponse.json();
        for(let i = 0; i < allLobbyInfo.length; i++) {
            // Add lobby to page
            const newRow = document.createElement('tr');
            const idElement = document.createElement('th');
            newRow.setAttribute('id', `${i}`);
            idElement.setAttribute('scope', 'row');
            idElement.innerText = i;
            const nameElement = document.createElement('td');
            nameElement.innerText = allLobbyInfo[i].name;
            const gameElement = document.createElement('td');
            gameElement.innerText = allLobbyInfo[i].game;
            const sizeElement = document.createElement('td');
            sizeElement.innerText = allLobbyInfo[i].players+'/'+allLobbyInfo[i].maxplayers;

            newRow.appendChild(idElement);
            newRow.appendChild(nameElement);
            newRow.appendChild(gameElement);
            newRow.appendChild(sizeElement);
            
            // Action Listener for Joining Lobby
            newRow.addEventListener('click', async function() {
                if (confirm('Join '+ allLobbyInfo[newRow.id].name +'? ')) {
                    allLobbyInfo[newRow.id].players += 1;
                    allLobbyInfo[newRow.id].users.push(user);
                    await fetch(url + '/updateLobby', {
                        method: 'POST',
                        body: JSON.stringify(allLobbyInfo[newRow.id]), 
                        headers: { 
                            'Content-type': 'application/json; charset=UTF-8'
                        } 
                    });
                    // Re-render the lobby browser to reflect change
                    await getAndRenderLobbyInfo();
                    // Render the new lobby to the left
                    await getAndRenderCurrentLobby();
                }
            });
            document.getElementById('lobby-browser-table').appendChild(newRow);
        }
    } else {
        alert('HTTP-Error: ' + allLobbyInfoResponse.status);
    }
}


/*
*   Fetches and renders info on the current lobby that the user is in
*/
async function getAndRenderCurrentLobby(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
    const lobby = await getCurrentLobby();
    if (lobby === -1) {
        // No lobby to render!
        document.getElementById('lobby-title').innerText='Click Lobby to Join';
        return;
    }
    // else, go through the render process
    const users = lobby.users;
    document.getElementById('lobby-title').innerText=lobby.name;
    document.getElementById('lobby-message').innerText=lobby.message;
    for(let i = 0; i < users.length; i++) {
        // Add user info to page
        const newRow = document.createElement('tr');
        const idElement = document.createElement('th');
        newRow.setAttribute('id', `${i}`);
        idElement.setAttribute('scope', 'row');
        idElement.innerText = i;
        const nameElement = document.createElement('td');
        nameElement.innerText = users[i];

        newRow.appendChild(idElement);
        newRow.appendChild(nameElement);
        
        // Action Listener for Adding Friend
        newRow.addEventListener('click', async function() {
            // Confirm with user
            if (confirm('Add '+ users[newRow.id] +' as a friend? '+newRow.id)) {
                // Bookkeeping the user and the friend they wish to add
                const me = await getUserInfo(user);
                const newFriend = await getUserInfo(users[newRow.id]);
                me[0].friends.push({
                    name: newFriend[0].name,
                    status: newFriend[0].status,
                    _id: newFriend[0]._id
                });
                // do it!
                await fetch(url + '/updateUser', {
                    method: 'POST',
                    body: JSON.stringify(me[0]), 
                    headers: { 
                        'Content-type': 'application/json; charset=UTF-8'
                    } 
                });
                // Re-render friends list to reflect change
                await getAndRenderFriendInfo();
            }
        });
        element.appendChild(newRow);
    }
}

/*
*   Refactored function that returns the current lobby that the user is in. Returns -1 if no lobby, returns the lobby info if user is in a lobby
*/
async function getCurrentLobby() {
    // Initial fetch
    const allLobbyInfoResponse = await fetch(url + '/readAllLobbies', {
        method: 'GET',
        headers: { 
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
    if (allLobbyInfoResponse.ok) {
        // search through the users of each lobby
        const allLobbyInfo = await allLobbyInfoResponse.json();
        for (let i = 0; i < allLobbyInfo.length; i++) {
            for (let j = 0; j < allLobbyInfo[i].users.length; j++) {
                if (allLobbyInfo[i].users[j] === user) {
                    return allLobbyInfo[i];
                }
            }
        }
        // Not found
        return -1;
    } else {
        // Error
        alert('HTTP-Error: ' + allLobbyInfoResponse.status);
    }
}