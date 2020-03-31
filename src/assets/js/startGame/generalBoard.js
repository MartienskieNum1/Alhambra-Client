"use strict";

let goToAlhambra = document.querySelector('.navigate');
let goToGameRules = document.querySelector('.showGameRules');

function init(){
    goToAlhambra.addEventListener('click', function() {
        window.location.href = "../src/myAlhambraIndex.html";
    });

    goToGameRules.addEventListener('click', function() {
        window.location.href = '../src/rules.html';
    });

    getStartGameInfo();
}

document.addEventListener("DOMContentLoaded", init);
