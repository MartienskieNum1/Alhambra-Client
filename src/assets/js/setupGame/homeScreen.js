"use strict";

let joinButton = document.querySelector('.join');
let createButton = document.querySelector('.create');

let init = () => {
    joinButton.addEventListener("click", function() {
        window.location.href = '../src/joinGame.html'
    });

    createButton.addEventListener('click', function () {
        window.location.href = '../src/createGame.html'
    });
};

document.addEventListener("DOMContentLoaded", init);

function showRules() {
    window.location.href = '../src/rules.html'
}
