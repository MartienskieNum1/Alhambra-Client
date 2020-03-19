"use strict";

let backButton = document.querySelector('.back');
let readyButton = document.querySelector('.ready');

let init = () => {
    backButton.addEventListener('click', function () {
        window.location.href = '../src/joinGame.html';
    });

    if (localStorage.getItem('ready')) {
        readyButton.innerHTML = 'Not ready'
    } else {
        readyButton.innerHTML = 'Ready'
    }

    setUpLobby();

    readyButton.addEventListener('click', readyUp);
};

document.addEventListener("DOMContentLoaded", init);