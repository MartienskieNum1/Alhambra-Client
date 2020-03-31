"use strict";

let backButton = document.querySelector('.back');

function init() {
    backButton.addEventListener('click', function () {
        window.history.back();
})}
document.addEventListener("DOMContentLoaded", init);