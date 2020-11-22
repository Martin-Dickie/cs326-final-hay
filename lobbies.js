'use strict';

const url = "https://floating-plateau-01072.herokuapp.com";
// const url = "http://localhost:8000";

let user = window.localStorage.getItem("username"); // 
if (!user) {
    user = window.prompt("Sign in with your username!");
    window.localStorage.setItem('username', user);
}

let userInfo;

async function getUserInfo() {
    const userInfoResponse = await fetch(url + '/readUser?name='+user);
    if (userInfoResponse.ok) { 
        userInfo = await userInfoResponse.json();
        console.log(userInfo);
        return userInfo;
    } else {
        alert('HTTP-Error: ' + userInfoResponse.status);
        return -1;
    }
}

getAndRenderFriendInfo(document.getElementById('friend-table-body'));
getAndRenderLobbyInfo(document.getElementById('lobby-browser-table'));

document.getElementById('createLobby').addEventListener('click', createLobby);

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
async function createLobby() {
    const name = prompt("Name of Lobby?");
    const game = prompt("What Game Will you Be Playing?");
    const status = 'Waiting for more players...';
    const players = 0;
    const maxplayers = prompt("Maximum Number of Players?");

    const newGame = {
        name: name,
        game: game,
        status: status,
        players: players,
        maxplayers: maxplayers,
        users: []
    };
    fetch(url + "/createLobby", {
        method: "POST",
        body: JSON.stringify(newGame), 
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    });

    window.alert("Lobby created! Click in the browser to join");
    getAndRenderLobbyInfo();
}

async function getAndRenderFriendInfo(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
    await getUserInfo();
    const friends = userInfo[0].friends;
    if (friends.length === 0) {
        document.getElementById("friend-header").innerText = "Join a Lobby and Click a User to add a friend";
    }
    for(let i = 0; i < friends.length; i++) {
        console.log("frond?");
        console.log(friends[i]);
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
                const userInfo2 = await getUserInfo();
                console.log(userInfo2[0]);
                console.log(newRow.id);
                userInfo2[0].friends.splice(parseInt(newRow.id), 1);
                await fetch(url + "/updateUser", {
                    method: "POST",
                    body: JSON.stringify(userInfo2[0]), 
                    headers: { 
                        "Content-type": "application/json; charset=UTF-8"
                    } 
                });
                // Re-render friends list:
                console.log("holy shit what");
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
        player,
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
            // newRow.addEventListener('click', function() {
            //     if (confirm('Join Lobby')) {
            //         // Remove Friend
            //         const updatedUser = JSON.parse(JSON.stringify(userInfo));
            //         updatedUser.friends = JSON.parse(JSON.stringify(friends.splice(parseInt(newRow.id), 1)));
            //         fetch(url + "/updateUser", {
            //             method: "POST",
            //             body: JSON.stringify(updatedUser), 
            //             headers: { 
            //                 "Content-type": "application/json; charset=UTF-8"
            //             } 
            //         });
            //         // Re-render friends list:
            //         getAndRenderFriendInfo(element);
            //     }
            // });

            element.appendChild(newRow);
        }
    } else {
        alert('HTTP-Error: ' + allLobbyInfoResponse.status);
    }
}