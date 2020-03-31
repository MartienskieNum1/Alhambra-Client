"use strict";

let goToAlhambra = document.querySelector('.navigate');

function init(){
    goToAlhambra.addEventListener('click', function () {
        window.location.href = "../../../myAlhambraIndex.html";
    });
    getStartGameInfo();

}

function showRules() {
    window.location.href = '../src/rules.html'
}

document.addEventListener("DOMContentLoaded", init);
