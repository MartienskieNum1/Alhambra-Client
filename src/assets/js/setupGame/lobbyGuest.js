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


    setInterval(function(e){ e.preventDefault(); allPlayersReady()},3000);
    setUpLobby();
    setInterval(function(e){ e.preventDefault(); setUpLobby()},3000);
    readyButton.addEventListener('click', readyUp);
};

document.addEventListener("DOMContentLoaded", init);