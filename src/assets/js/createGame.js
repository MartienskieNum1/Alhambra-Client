"use strict";

let backButton = document.querySelector('.back');
let createButton = document.querySelector('input[type="submit"]');
let usernameInput = document.querySelector('input[id="username"]');

let init = () => {
    backButton.addEventListener('click', function () {
        window.location.href = '../src/index.html';
    });

    createButton.addEventListener('click', function(e) {
        e.preventDefault();

        let username = usernameInput.value;

        createGame(username);
        goToPageInSecond('../src/lobbyHost.html');
    });

};

document.addEventListener("DOMContentLoaded", init);