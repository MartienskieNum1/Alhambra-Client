"use strict";

const BACKBUTTON = document.querySelector('.back');
const CREATEBUTTON = document.querySelector('input[type="submit"]');
const USERNAMEINPUT = document.querySelector('input[id="username"]');

const init = () => {
    BACKBUTTON.addEventListener('click', function () {
        window.location.href = '../src/index.html';
    });

    CREATEBUTTON.addEventListener('click', function(e) {
        e.preventDefault();

        const USERNAME = USERNAMEINPUT.value;

        createGame(USERNAME);
        goToPageInSecond('../src/lobby.html');
    });

};
document.addEventListener("DOMContentLoaded", init);

const createGame = (username) => {
    let gameId = null;
    fetchFromServer(`${config.root}games`, 'POST', {"prefix": "group27"}).then(
        function (response) {
            gameId = response;
            joinGame(username, gameId);
        });
};
