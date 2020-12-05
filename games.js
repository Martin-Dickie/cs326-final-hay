'use strict';

// URL is website we're hosting at.
const url = "https://floating-plateau-01072.herokuapp.com";

// Game grid is the grid containing available games
const gameGrid = document.getElementById('gameGrid');

// Initialize the page
initialize();

// Initalizes the games DB, and then renders it.
async function initialize() {
    await loadGames().then(() => { renderGames(); });
    console.log("initialized");
}

// Loads games from the gamesDB which is in mongo
async function loadGames() {
    const allGameInfoResponse = await fetch(url + '/readAllGames', {
        method: "GET",
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        }});
    if (allGameInfoResponse.ok) {
        const games = await allGameInfoResponse.json();
        window.games = games;
        console.log(games);
    }
    else {
        console.log('failed to read all games');
    }
}

// Renders the games as images in a grid.
// if you click on one it will create a popup with information about the game and a few buttons which link elsewhere
function renderGames() {
    let counter = 0; // number of games added
    for (let i = 0; i < window.games.length / 3; ++i) {
        // Creates a row for the grid
        const row = document.createElement('div');
        row.classList.add('row');
        row.setAttribute('id', "row " + (i + 1));
        for (let j = 0; j < 3; ++j) {
            // if there's not a clean number of games, it will cut off to not break from indexing incorrectly
            if (counter >= window.games.length) {
                break;
            }
            const currentGame = window.games[counter].data; // currentGame 
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
            popupContainer.setAttribute('id', currentGame.name + ".popup_container");

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

function drawPopup(name) {
    console.log("clicked");
    const popup = document.getElementById(name);
    popup.classList.toggle('show');
}