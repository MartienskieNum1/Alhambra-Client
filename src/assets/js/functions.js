"use strict";

let goToPageInSecond = (page) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(window.location.href = page);
        }, 500);
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
    fetchFromServer(`${config.root}games/${gameId}/players`, 'POST', {playerName: `${username}`}).then(
        function (response) {
            console.log(response);
            localStorage.setItem('playerToken', `${response}`);
        });
};

let showAllGames = () => {
    fetchFromServer(`${config.root}games?details=true&prefix=group${config.groupnumber}`, 'GET').then(
        function (response) {
            console.log(response);
        });
};