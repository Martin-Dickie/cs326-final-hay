'use strict';

const { ObjectId } = require("mongodb");

const url = "https://floating-plateau-01072.herokuapp.com";
// const url = "http://localhost:8000";

let user = window.localStorage.getItem("username"); // 
if (!user) {
    user = window.prompt("Sign in with your username!");
    window.localStorage.setItem('username', user);
}

let userInfo;

async function getUserInfo(name) {
    const userInfoResponse = await fetch(url + '/readUser?name='+name);
    if (userInfoResponse.ok) { 
        userInfo = await userInfoResponse.json();
        return userInfo;
    } else {
        alert('HTTP-Error: ' + userInfoResponse.status);
        return -1;
    }
}

getAndRenderFriendInfo(document.getElementById('friend-table-body'));
getAndRenderLobbyInfo(document.getElementById('lobby-browser-table'));


/*
*   Prompts the user to create a lobby 
*   Lobby info:
*   {
*       name: string,
*       game: string,
*       status: string,
*       players: number,
*       maxplayers: number,
*       users: [user, user....]
*   };
*/
document.getElementById('createLobby').addEventListener('click', async function () {
    const name = prompt("Name of Lobby?");
    const game = prompt("What Game Will you Be Playing?");
    const status = 'Waiting for more players...';
    const players = 0;
    const maxplayers = prompt("Maximum Number of Players?");

    const newGame = {
        _id: ObjectId(),
        name: name,
        game: game,
        status: status,
        players: players,
        maxplayers: maxplayers,
        users: []
    };
    await fetch(url + "/createLobby", {
        method: "POST",
        body: JSON.stringify(newGame), 
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    });

    window.alert("Lobby created! Click in the browser to join");
    await getAndRenderLobbyInfo(document.getElementById('lobby-browser'));
});
/*
*   Leaves current Lobby
*/
document.getElementById('leaveLobby').addEventListener('click', async function () {
    if (confirm("Leave Lobby?")) {
        const allLobbyInfoResponse = await fetch(url + '/readAllLobbies');
        if (allLobbyInfoResponse.ok) { 
            const allLobbyInfo = await allLobbyInfoResponse.json();
            let lobby;
            for (let i = 0; i < allLobbyInfo.length; i++) {
                for (let j; j < allLobbyInfo[i].users.length; j++) {
                    if (allLobbyInfo[i].users[j].name === user) {
                        lobby = allLobbyInfo[i];
                        lobby.players -= 1;
                        lobby.users.pop(j);
                        break;
                    }
                }
            }
            await fetch(url + "/updateLobby", {
                method: "POST",
                body: JSON.stringify(lobby), 
                headers: { 
                    "Content-type": "application/json; charset=UTF-8"
                } 
            });

            window.alert("You have left the lobby!");
            await getAndRenderLobbyInfo(document.getElementById('lobby-browser'));
            await getAndRenderCurrentLobby(document.getElementById('current-lobby'));
        }
    }
});


async function getAndRenderFriendInfo(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
    await getUserInfo(user);
    const friends = userInfo[0].friends;
    if (friends.length === 0) {
        document.getElementById("friend-header").innerText = "Join a Lobby and Click a User to add a friend";
    }
    for(let i = 0; i < friends.length; i++) {
        // Add friends to page
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
                await fetch(url + "/updateUser", {
                    method: "POST",
                    body: JSON.stringify(userInfo2[0]), 
                    headers: { 
                        "Content-type": "application/json; charset=UTF-8"
                    } 
                });
                // Re-render friends list:
                await getAndRenderFriendInfo(element);
            }
        });
        element.appendChild(newRow);
        
    }
}


/*
*   Lobby: {
        name,
        game,
        status,
        players,
        maxplayers,
        users,
    }
*/
async function getAndRenderLobbyInfo(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
    const allLobbyInfoResponse = await fetch(url + '/readAllLobbies');
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
            const statusElement = document.createElement('td');
            statusElement.innerText = allLobbyInfo[i].status;
            const sizeElement = document.createElement('td');
            sizeElement.innerText = allLobbyInfo[i].size+'/'+allLobbyInfo[i].maxplayers;

            newRow.appendChild(idElement);
            newRow.appendChild(nameElement);
            newRow.appendChild(gameElement);
            newRow.appendChild(statusElement);
            newRow.appendChild(sizeElement);
            
            // Action Listener for Joining Lobby
            newRow.addEventListener('click', async function() {
                if (confirm('Join '+ allLobbyInfo[newRow.id].name +'? '+newRow.id)) {
                    allLobbyInfo[newRow.id].players += 1;
                    allLobbyInfo[newRow.id].users.push(user);
                    await fetch(url + "/updateLobby", {
                        method: "POST",
                        body: JSON.stringify(allLobbyInfo[newRow.id]), 
                        headers: { 
                            "Content-type": "application/json; charset=UTF-8"
                        } 
                    });
                    await getAndRenderCurrentLobby(document.getElementById('current-lobby'));
                }
            });
            element.appendChild(newRow);
        }
    } else {
        alert('HTTP-Error: ' + allLobbyInfoResponse.status);
    }
}



async function getAndRenderCurrentLobby(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
    const lobby = await getCurrentLobby();
    const users = lobby.users;
    
    for(let i = 0; i < users.length; i++) {
        // Add lobby to page
        const newRow = document.createElement('tr');
        const idElement = document.createElement('th');
        newRow.setAttribute('id', `${i}`);
        idElement.setAttribute('scope', 'row');
        idElement.innerText = i;
        const nameElement = document.createElement('td');
        nameElement.innerText = users[i].name;

        newRow.appendChild(idElement);
        newRow.appendChild(nameElement);
        
        // Action Listener for Adding Friend
        newRow.addEventListener('click', async function() {
            if (confirm('Add '+ users[newRow.id].name +' as a friend? '+newRow.id)) {
                const me = await getUserInfo(user);
                const newFriend = await getUserInfo(users[newRow.id].name);
                me.friends.push({
                    name: newFriend.name,
                    status: newFriend.status,
                    _id: newFriend._id
                });
                await fetch(url + "/updateUser", {
                    method: "POST",
                    body: JSON.stringify(me), 
                    headers: { 
                        "Content-type": "application/json; charset=UTF-8"
                    } 
                });
                await getAndRenderCurrentLobby(element);
            }
        });
        element.appendChild(newRow);
    }
}


async function getCurrentLobby() {
    const allLobbyInfoResponse = await fetch(url + '/readAllLobbies');
    if (allLobbyInfoResponse.ok) { 
        const allLobbyInfo = await allLobbyInfoResponse.json();
        for (let i = 0; i < allLobbyInfo.length; i++) {
            for (let j; j < allLobbyInfo[i].users.length; j++) {
                if (allLobbyInfo[i].users[j].name === user) {
                    return allLobbyInfo[i];
                }
            }
        }
        return -1;
    } else {
        return -1;
    }
}