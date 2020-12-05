'use strict';

// const { ObjectId } = require("mongodb");

// const url = "https://floating-plateau-01072.herokuapp.com";

// const secrets = require('./secrets.json');


// const steamKey = secrets.steamKey;
// const steamAPIURL = "https://api.steampowered.com/ISteamApps/GetAppList/v2/key=" + steamKey;

// const games = [];

// async function makegameDB() {
//     const response = await fetch('./steamapps.json');
//     let gameList;
//     if (response.ok) {
//         gameList = await response.json();
//         gameList = gameList.applist.apps;
//     }
//     else {
//         console.error("Failed to read steamapps.json failed to load");
//     }
    
//     for (const apps of gameList){
//         const game = await fetch("https://store.steampowered.com/api/appdetails?appids=" + apps.appid);
//         if(game.ok){
//             let gameApp = await game.json();
//             gameApp.categories.forEach( category => { if(category["description"] === "multiplayer") { games.add(gameApp); } } );
//         }

//     }
// }

const url = "https://floating-plateau-01072.herokuapp.com";

initialize();
async function initialize(){
    console.log("initialized");
    await loadGames().then(() => {renderGames();});
}


async function loadGames(){
    const allGameInfoResponse = await fetch(url + '/readAllGames');
    if (allGameInfoResponse.ok) { 
        const games = await allGameInfoResponse.json();
        window.games = games;
        console.log(games);
    }
    else{
        console.log('failed to read all games');
    }
}

const gameGrid = document.getElementById('gameGrid');

function renderGames(){
    let counter = 0;
    for(let i = 0; i < window.games.length/3; ++i){
        const row = document.createElement('div');
        row.classList.add('row');
        row.setAttribute('id',"row " + (i+1));
        for(let j = 0; j < 3; ++j){
            if(counter >= window.games.length){
                break;
            }
            const currentGame = window.games[counter].data;
            const gameTile = document.createElement('div');
            gameTile.classList.add('col');
            const gameInfo = document.createElement('img');
            gameInfo.setAttribute('src', currentGame.header_image);
            gameInfo.setAttribute('id', currentGame.name + ".gameInfo");
            gameInfo.setAttribute('alt', currentGame.name);
            const gameInfoPopup = document.createElement('span');
            gameInfoPopup.classList.add('popuptext');
            gameInfoPopup.setAttribute('id', currentGame.name + ".popup");
            gameInfoPopup.innerHTML = currentGame.name;

            const createLobbyButton = document.createElement('a');
            createLobbyButton.setAttribute('id', currentGame.name + ".lobby_button");
            createLobbyButton.setAttribute('type', 'button');
            createLobbyButton.classList.add("btn", "btn-secondary");
            createLobbyButton.addEventListener('click', () => {
                location.assign('https://floating-plateau-01072.herokuapp.com/'); // currently just links to lobbies, will have a post request
            });
            createLobbyButton.innerText = "Create lobby";
            
            const websiteButton = document.createElement('a');
            websiteButton.setAttribute('id', currentGame.name + ".website_button");
            websiteButton.setAttribute('type', 'button');
            websiteButton.classList.add("btn", "btn-secondary");
            websiteButton.addEventListener('click', () => {
                location.assign(currentGame.website);
            });
            websiteButton.innerText = "Website";

            const findLobbyButton = document.createElement('a');
            findLobbyButton.setAttribute('id', currentGame.name + ".lobby_button");
            findLobbyButton.setAttribute('type', 'button');
            findLobbyButton.classList.add("btn", "btn-secondary");
            findLobbyButton.addEventListener('click', () => {
                location.assign('https://floating-plateau-01072.herokuapp.com/');
            });
            findLobbyButton.innerText = "Find Lobby";

            const popupContainer = document.createElement('div');
            popupContainer.classList.add('row');
            popupContainer.setAttribute('id',currentGame.name + ".popup_container");

            popupContainer.appendChild(websiteButton);
            popupContainer.appendChild(findLobbyButton);
            popupContainer.appendChild(createLobbyButton);

            gameInfoPopup.appendChild(popupContainer);
            gameTile.appendChild(gameInfo);
            gameTile.setAttribute('id', currentGame.name + ".gameTile");
            gameTile.appendChild(gameInfoPopup);
            gameTile.classList.add('popup');
            gameTile.addEventListener('click', () => {
                drawPopup(currentGame.name + ".popup");
            });

            row.appendChild(gameTile);

            counter++;
        }
        gameGrid.appendChild(row);
    }
}

function drawPopup(name){
    console.log("clicked");
    const popup = document.getElementById(name);
    popup.classList.toggle('show');
}