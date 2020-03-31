"use strict";

let goBack = document.querySelector('.back');

function init(){
    goBack.addEventListener('click', function () {
        window.location.href = "../src/generalBoard.html";
    });
    getAlhambraInfo();
}

document.addEventListener("DOMContentLoaded", init);
