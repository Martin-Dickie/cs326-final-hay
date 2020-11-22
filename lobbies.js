'use strict';

const url = "https://floating-plateau-01072.herokuapp.com";
// const url = "http://localhost:8000";

const user = window.localStorage.getItem("username"); // 
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
}

async function getAndRenderFriendInfo(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
    const userInfoResponse = await fetch(url + '/readUser?name='+user);
    if (userInfoResponse.ok) { 
        const userInfo = await userInfoResponse.json();
        console.log(userInfo);
        const friends = JSON.parse(userInfo[0].friends);
        console.log(friends);
        for(let i = 0; i < friends.length; i++) {
            const friendsInfosResponse = await fetch(url + '/readUser?name='+friends.name);
            if (friendsInfosResponse.ok) { 
                const friendsInfo = await friendsInfosResponse.json();

                // Add friends to page
                const newRow = document.createElement('tr');
                newRow.setAttribute('id', `${i}`);
                const idElement = document.createElement('th');
                idElement.setAttribute('scope', 'row');
                idElement.innerText = friendsInfo.name;
                const nameElement = document.createElement('tr');
                nameElement.innerText = friendsInfo.name;
                const statusElement = document.createElement('td');
                statusElement.innerText = friendsInfo.status;
                newRow.appendChild(nameElement);
                newRow.appendChild(statusElement);

                // Action Listener for Removing Friend
                newRow.addEventListener('click', function() {
                    if (confirm('Remove Friend?')) {
                        // Remove Friend
                        const updatedUser = JSON.parse(JSON.stringify(userInfo));
                        updatedUser.friends = userInfo.friends.splice(parseInt(newRow.id), 1);
                        fetch(url + "/updateUser", {
                            method: "POST",
                            body: JSON.stringify(updatedUser), 
                            headers: { 
                                "Content-type": "application/json; charset=UTF-8"
                            } 
                        });
                        // Re-render friends list:
                        getAndRenderFriendInfo(element);
                    }
                });
                element.appendChild(newRow);
            } else {
                alert('HTTP-Error: ' + friendsInfosResponse.status);
            }
        }
    } else {
        alert('HTTP-Error: ' + userInfoResponse.status);
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

            element.appendChild(newRow);
        }
    } else {
        alert('HTTP-Error: ' + allLobbyInfoResponse.status);
    }
}