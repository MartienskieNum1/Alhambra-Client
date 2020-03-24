"use strict";

let backButton = document.querySelector('.back');
let readyButton = document.querySelector('.ready');

let init = () => {
    backButton.addEventListener('click', function () {
        window.location.href = '../src/createGame.html';
    });

    if (localStorage.getItem('ready')) {
        readyButton.innerHTML = 'Not ready'
    } else {
        readyButton.innerHTML = 'Ready'
    }

    checkAllPlayersReady();
    setInterval(function(){checkAllPlayersReady()},2000);
    setUpLobby();
    setInterval(function(){setUpLobby()},2000);

    readyButton.addEventListener('click', readyUp);
};

document.addEventListener("DOMContentLoaded", init);
