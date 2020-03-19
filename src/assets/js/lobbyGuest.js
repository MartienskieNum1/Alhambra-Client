"use strict";

let backButton = document.querySelector('.back');

let init = () => {
    backButton.addEventListener('click', function () {
        window.location.href = '../src/joinGame.html';
    });

    setUpLobby();
};

document.addEventListener("DOMContentLoaded", init);