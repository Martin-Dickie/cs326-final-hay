'use strict';

const url = "https://somethingsomethingsomething.herokuapp.com";

const user = 'test'; // 
getAndRenderFriendInfo(document.getElementById('friend-table-body'));
getAndRenderLobbyInfo(document.getElementById('lobby-browser-table'));

async function getAndRenderFriendInfo(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
    const userInfoResponse = await fetch(url + '/readUser?name='+user);
    if (userInfoResponse.ok) { 
        const userInfo = await userInfoResponse.json();
        for(let i = 0; i < userInfo.friends.length; i++) {
            const friendsInfosResponse = await fetch(url + '/readUser?name='+userInfo.friends[i].name);
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
                        getAndRenderFriendInfo();
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