"use strict";

const BACKBUTTON = document.querySelector('.back');

function init() {
    BACKBUTTON.addEventListener('click', function () {
        window.history.back();
});}
document.addEventListener("DOMContentLoaded", init);
