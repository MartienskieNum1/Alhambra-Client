"use strict";

let backButton = document.querySelector('.back');
let usernameInput = document.querySelector('input[id="username"]');
let gameIdInput = document.querySelector('select');
let joinButton = document.querySelector('input[type="submit"]');

let init = () => {
    backButton.addEventListener('click', function () {
        window.location.href = '../src/index.html';
    });

    fetchFromServer(`${config.root}games?details=false&prefix=group${config.groupnumber}`,'GET').then(function(response){
        console.log(response);
        gameIdInput.innerHTML = '';
        response.forEach(game => {
            gameIdInput.innerHTML += `<option>${game}</option>`;
        });
    });


    joinButton.addEventListener('click', function (e) {
        e.preventDefault();

        let gameId = gameIdInput.value;
        let username = usernameInput.value;

        joinGame(username, gameId);
        goToPageInSecond('../src/lobbyGuest.html');
    });
};

document.addEventListener("DOMContentLoaded", init);