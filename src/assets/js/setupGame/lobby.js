"use strict";

let readyButton = document.querySelector('.ready');
let leaveButton = document.querySelector('.leave');

let init = () => {
    leaveButton.addEventListener('click', leaveGame);

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