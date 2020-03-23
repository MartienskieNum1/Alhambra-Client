"use strict";

let goToPageInSecond = (page) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(window.location.href = page);
        }, 1000);
    });
};

let createGame = (username) => {
    let gameId = null;
    fetchFromServer(`${config.root}games`, 'POST', {"prefix": "group27"}).then(
        function (response) {
            gameId = response;
            joinGame(username, gameId);
        });
};

let joinGame = (username, gameId) => {
    username = username.toLowerCase();
    fetchFromServer(`${config.root}games/${gameId}/players`, 'POST', {playerName: `${username}`}).then(
        function (response) {
            console.log(response);
            localStorage.setItem('playerToken', `${response}`);
            localStorage.setItem('username', username);
            localStorage.setItem('gameId', gameId);
        });
};

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
        })
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
            function (response) {
                localStorage.removeItem('ready');
                readyButton.innerHTML = 'Ready';
            }
        );
    }
};

function checkAllPlayersReady(){
    let amountReady = document.querySelector('.amount-ready');
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            console.log(response);
            amountReady.innerHTML = `${response.readyCount}`;
            if(response.started === true){
                localStorage.removeItem('ready');
                gameStart()
            }
        });
}

function gameStart() {

    goToPageInSecond('../src/general_board.html')

}
