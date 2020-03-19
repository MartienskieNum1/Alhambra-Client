"use strict";

let joinGame = (e) => {
    e.preventDefault();
    let username = usernameInput.value.toLowerCase();
    let gameID = gameIDInput.value;

    fetchFromServer(`${config.root}games/${gameID}/players`, 'POST', {playerName: `${username}`}).then(
        function (response) {
            console.log(response);
            localStorage.setItem('playerToken', `${response}`);
            window.location.pathname = 'webclient/src/lobbyGuest.html';
        });
};