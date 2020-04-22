"use strict";

let readyButton = document.querySelector('.ready');
let leaveButton = document.querySelector('.leave');
let popupLeftGame = document.querySelector('.popupLeftGame');

let init = () => {
    leaveButton.addEventListener('click', leaveGame);

    if (localStorage.getItem('ready')) {
        readyButton.innerHTML = 'Not ready';
    } else {
        readyButton.innerHTML = 'Ready';
    }

    checkAllPlayersReady();
    setInterval(function(){checkAllPlayersReady();},2000);
    setUpLobby();
    setInterval(function(){setUpLobby();},2000);

    readyButton.addEventListener('click', readyUp);
};
document.addEventListener("DOMContentLoaded", init);

let leaveGame = () => {
    let gameId = localStorage.getItem('gameId');
    let username = localStorage.getItem('username');
    fetchFromServer(`${config.root}games/${gameId}/players/${username}`, 'DELETE').then(
        function () {
            localStorage.clear();
            showPopupLeftGame();

        }
     );
};

function showPopupLeftGame() {
    console.log("test");
    popupLeftGame.classList.remove('hidden');
}


function checkAllPlayersReady(){
    let amountReady = document.querySelector('.amountReady');
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            console.log(response);
            amountReady.innerHTML = `${response.readyCount}`;
            if(response.started === true){
                localStorage.removeItem('ready');
                goToPageInSecond('../src/generalBoard.html');
            }
        });
}

let setUpLobby = () => {
    let gameId = localStorage.getItem('gameId');
    let playerList = document.querySelector('.players');
    let gameIdElement = document.querySelector('.gameID');

    gameIdElement.innerHTML = gameId;

    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            playerList.innerHTML = "";
            for (let player of response.players) {
                playerList.innerHTML += `<li>${player}</li>`;
            }
        });
};

let readyUp = () => {
    let gameId = localStorage.getItem('gameId');
    let username = localStorage.getItem('username');

    if (!localStorage.getItem('ready')) {
        fetchFromServer(`${config.root}games/${gameId}/players/${username}/ready`, 'PUT').then(
            function (response) {
                localStorage.setItem('ready', `${response}`);
                readyButton.innerHTML = 'Not ready';
            }
        );
    }

    if (localStorage.getItem('ready')) {
        fetchFromServer(`${config.root}games/${gameId}/players/${username}/ready`, 'DELETE').then(
            function () {
                localStorage.removeItem('ready');
                readyButton.innerHTML = 'Ready';
            }
        );
    }
};
