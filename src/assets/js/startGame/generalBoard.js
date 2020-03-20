"use strict";

let goToAlhambra = document.querySelector('.navigate');

function init(){
    goToAlhambra.addEventListener('click', function () {
        window.location.href = "../src/MyAlhambraindex.html";
    });

    getStartGameInfo();

}
document.addEventListener("DOMContentLoaded", init);
