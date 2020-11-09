'use strict';

const url = "https://somethingsomethingsomething.herokuapp.com";

const user = 'test'; // 
getFriendInfo();
getLobbyInfo();

async function getFriendInfo() {
    const userInfoResponse = await fetch(url + '/readUser?name='+user);
    if (userInfoResponse.ok) { 
        const userInfo = await userInfoResponse.json();
        for(const friendName of userInfo.friends) {
            const friendsInfosResponse = await fetch(url + '/readUser?name='+friendName);
            if (friendsInfosResponse.ok) { 
                const friendsInfo = await friendsInfosResponse.json();

                // Add friends to page
                const tableBody = document.getElementById("friend-table-body");
                tableBody.innerHTML += '<tr> <th scope=\"row\">'+ friendsInfo.name +'</th> <td>'+ friendsInfo.status +'</td></tr>';
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
async function getLobbyInfo() {
    const allLobbyInfoResponse = await fetch(url + '/readAllLobbies');
    if (allLobbyInfoResponse.ok) { 
        const allLobbyInfo = await allLobbyInfoResponse.json();
        for(let i = 0; i < allLobbyInfo.length; i++) {
            // Add lobby to page
            const tableBody = document.getElementById("lobby-browser-table");
            tableBody.innerHTML += '<tr> <th scope="row">'+i+'</th><td>'+
                                    allLobbyInfo[i].name +'</td><td>'+ 
                                    allLobbyInfo[i].game +'</td> <td>'+ 
                                    allLobbyInfo[i].status +'</td> <td>'+ 
                                    allLobbyInfo.users+'/'+ allLobbyInfo.maxplayers +'</td></tr>';
        }
    } else {
        alert('HTTP-Error: ' + allLobbyInfoResponse.status);
    }
}