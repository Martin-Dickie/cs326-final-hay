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
        }
    });
    if (allGameInfoResponse.ok) {
        const games = await allGameInfoResponse.json();
        window.games = games;
        console.log(games);
    }
    else {
        console.log(allGameInfoResponse);
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
            // Make a gameTile which holds all the game information and popup information
            gameTile.classList.add('col');
            
            // Game info is the image and data
            const gameInfo = document.createElement('img');
            gameInfo.setAttribute('src', currentGame.header_image);
            gameInfo.setAttribute('id', currentGame.name + ".gameInfo");
            gameInfo.setAttribute('alt', currentGame.name);

            // Game info Popup is for when you click on the game image it will popup with additional things inside
            const gameInfoPopup = document.createElement('span');
            gameInfoPopup.classList.add('popuptext');
            gameInfoPopup.setAttribute('id', currentGame.name + ".popup");
            gameInfoPopup.innerHTML = currentGame.name;

            // createLobbyButton is a button in the popup to create a lobby for the specified game
            const createLobbyButton = document.createElement('a');
            createLobbyButton.setAttribute('id', currentGame.name + ".lobby_button");
            createLobbyButton.setAttribute('type', 'button');
            createLobbyButton.classList.add("btn", "btn-secondary", "popupButton");
            createLobbyButton.addEventListener('click', async function () {
                const name = prompt("Name of Lobby?");
                const game = currentGame.name;
                const status = 'Waiting for more players...';
                const players = 0;
                const maxplayers = prompt("Maximum Number of Players?");
                // Make a new game with the given information, and game set as the current game
                const newGame = {
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
                location.assign('https://floating-plateau-01072.herokuapp.com/lobbies');
                window.alert("Lobby created! Click in the browser to join");
            });
            createLobbyButton.innerText = "Create lobby";

            // Button inside the popup to link to the game's website, via the website field of steam json items.
            const websiteButton = document.createElement('a');
            websiteButton.setAttribute('id', currentGame.name + ".website_button");
            websiteButton.setAttribute('type', 'button');
            websiteButton.classList.add("btn", "btn-secondary", "popupButton");
            websiteButton.addEventListener('click', () => {
                location.assign(currentGame.website);
            });
            websiteButton.innerText = "Website";

            // find lobby just brings you to the lobby page, to find lobbies. Currently does not sort by game or anything
            const findLobbyButton = document.createElement('a');
            findLobbyButton.setAttribute('id', currentGame.name + ".lobby_button");
            findLobbyButton.setAttribute('type', 'button');
            findLobbyButton.classList.add("btn", "btn-secondary", "popupButton");
            findLobbyButton.addEventListener('click', () => {
                location.assign('https://floating-plateau-01072.herokuapp.com/lobbies');
            });
            findLobbyButton.innerText = "Find Lobby";

            // container to hold all the buttons to look a little nicer
            const popupContainer = document.createElement('div');
            popupContainer.setAttribute('id', currentGame.name + ".popup_container");
            // add all the buttons to container
            popupContainer.appendChild(websiteButton);
            popupContainer.appendChild(findLobbyButton);
            popupContainer.appendChild(createLobbyButton);
            // add container to the popup
            gameInfoPopup.appendChild(popupContainer);
            // add the gameInfo to the tile
            gameTile.appendChild(gameInfo);
            gameTile.setAttribute('id', currentGame.name + ".gameTile");
            gameTile.appendChild(gameInfoPopup);
            gameTile.classList.add('popup');
            gameTile.addEventListener('click', () => {
                drawPopup(currentGame.name + ".popup");
            });

            row.appendChild(gameTile);
            counter++; // increment game counter
        }
        gameGrid.appendChild(row);
    }
}

// pops up the clicked game, and removes the previous popups
function drawPopup(name) {
    console.log("clicked");
    const allPopups = document.getElementsByClassName('show');
    const popup = document.getElementById(name);
    const storedClasses = popup.classList;
    for(const pop of allPopups){ if(pop.id !== popup.id){pop.classList.remove('show');}}
    popup.classList = storedClasses;
    popup.classList.toggle('show');
}