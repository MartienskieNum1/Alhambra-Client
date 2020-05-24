"use strict";

let goToPageInSecond = (page) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(window.location.href = page);
        }, 1000);
    });
};

let joinGame = (username, gameId) => {
    username = username.toLowerCase();
    fetchFromServer(`${config.root}games/${gameId}/players`, 'POST', {playerName: `${username}`}).then(
        function (response) {
            localStorage.setItem('playerToken', `${response}`);
            localStorage.setItem('username', username);
            localStorage.setItem('gameId', gameId);
        });
};
