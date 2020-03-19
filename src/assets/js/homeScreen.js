"use strict";

let joinButton = document.querySelector('.join');
let createButton = document.querySelector('.create');

let navigate = () => {
    joinButton.addEventListener("click", function() {
        window.location.pathname = 'webclient/src/joinGame.html'
    });

    createButton.addEventListener('click', function () {
        window.location.pathname = 'webclient/src/createGame.html'
    });
};

document.addEventListener("DOMContentLoaded", navigate);
