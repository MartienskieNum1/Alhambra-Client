"use strict";

document.addEventListener("DOMContentLoaded", init);


let backButton = document.querySelector('.back');

function init() {
    backButton.addEventListener('click', function () {
        window.history.back();
})}