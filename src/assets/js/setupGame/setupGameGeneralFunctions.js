"use strict";

let goToPageInSecond = (page) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(window.location.href = page);
        }, 1000);
    });
};

let joinGame = (username, gameId) => {
    const lowerUsername = username.toLowerCase();
    fetchFromServer(`${config.root}games/${gameId}/players`, 'POST', {playerName: `${lowerUsername}`}).then(
        function (response) {
            localStorage.setItem('playerToken', `${response}`);
            localStorage.setItem('username', lowerUsername);
            localStorage.setItem('gameId', gameId);
        });
};
