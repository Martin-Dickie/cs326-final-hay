'use strict';

const { ObjectId } = require("mongodb");

const url = "https://floating-plateau-01072.herokuapp.com";

const secrets = require('./secrets.json');


const steamKey = secrets.steamKey;
const steamAPIURL = "https://api.steampowered.com/ISteamApps/GetAppList/v2/key=" + steamKey;

const games = [];

async function makegameDB() {
    const response = await fetch('./steamapps.json');
    let gameList;
    if (response.ok) {
        gameList = await response.json();
        gameList = gameList.applist.apps;
    }
    else {
        console.error("Failed to read steamapps.json failed to load");
    }
    
    for (const apps of gameList){
        const game = await fetch("https://store.steampowered.com/api/appdetails?appids=" + apps.appid);
        if(game.ok){
            let gameApp = await game.json();
            gameApp.categories.forEach( category => { if(category["description"] === "multiplayer") { games.add(gameApp); } } );
        }

    }
}

window.onload = initialize;
function initialize(){
    loadGames();
    renderGames();

}


async function loadGames(){
    const loadGamesCall = await fetch("gamesDB.json");
    if(loadGamesCall.ok){
        games = await loadGamesCall.json();
        window.games = games;
    }
}
