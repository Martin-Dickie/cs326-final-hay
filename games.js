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

window.onload = initialize;
async function initialize(){
    console.log("initialized");
    await loadGames();
    renderGames();

}


async function loadGames(){
    const loadGamesCall = await fetch("gamesDB.json");
    if(loadGamesCall.ok){
        const games = await loadGamesCall.json();
        window.games = games;
        console.log(games);
    }
}

const gameGrid = document.getElementById('gameGrid');

function renderGames(){
    let counter = 0;
    for(let i = 0; i < window.games.length/3; ++i){
        const row = document.createElement('div');
        row.classList.add('row');
        row.setAttribute('id',"row " + i+1);
        for(let j = 0; j < 3; ++j){
            const currentGame = window.games[counter].data;
            const gameTile = document.createElement('div');
            gameTile.classList.add('col');
            const gameInfo = document.createElement('img');
            gameInfo.setAttribute('src', currentGame.header_image);
            gameInfo.setAttribute('id', currentGame.name + ".gameInfo");
            gameInfo.setAttribute('alt', currentGame.name);
            gameTile.appendChild(gameInfo);
            gameTile.setAttribute('id', currentGame.name + ".gameTile");
            row.appendChild(gameTile);
            counter++;
        }
        gameGrid.appendChild(row);
    }
}