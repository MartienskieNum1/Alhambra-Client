"use strict";

let goBack = document.querySelector('.back');
let reserveUl = document.querySelector('#reserve');

function init(){
    goBack.addEventListener('click', function () {
        window.location.href = "../src/generalBoard.html";
    });
    getAlhambraInfo();
    makeDivs();
}

document.addEventListener("DOMContentLoaded", init);

function makeDivs(){
    let output = document.querySelector("#yourAlhambra");
    output.innerHTML = "";
    for (let i = 0;i < 11;i++){
        for (let j = 0;j < 11;j++){
            output.innerHTML += `<div class="buildingInAlhambra" data-column="${i}" data-row="${j}">hallo</div>`
        }
    }
}


function displayTotalValue() {
    let totalValue = document.querySelector(".totalValue");
    let total = 0;
    let moneys = document.querySelectorAll(".yourMoney p");

    moneys.forEach(money => {
        total += parseInt(money.textContent);
    });

    totalValue.innerHTML = `Total value: ${total}`
}

function populateReserve(response) {
    let username = localStorage.getItem('username');
    let myReserve;
    for (let player of response.players) {
        if (player.name === username) {
            myReserve = player.reserve;
        }
    }

    reserveUl.innerHTML = "";
    for (let building of myReserve) {
        reserveUl.innerHTML += `<li class="${building.type}">${building.cost}</li>`;
        for (let [key, value] of Object.entries(building.walls)) {
            if (value) {
                reserveUl.lastElementChild.classList.add(key);
            }
        }
    }
}

function getAlhambraInfo() {
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            givePlayerMoney(response);
            displayTotalValue();
            populateReserve(response);
        });
}
