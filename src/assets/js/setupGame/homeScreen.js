"use strict";

const JOINBUTTON = document.querySelector('.join');
const CREATEBUTTON = document.querySelector('.create');

let init = () => {
    JOINBUTTON.addEventListener("click", function() {
        window.location.href = '../src/joinGame.html';
    });

    CREATEBUTTON.addEventListener('click', function () {
        window.location.href = '../src/createGame.html';
    });
};

document.addEventListener("DOMContentLoaded", init);

function showRules() {
    window.location.href = '../src/rules.html';
}
