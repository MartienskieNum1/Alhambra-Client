"use strict";

let goBack = document.querySelector('.back');

function init(){
    goBack.addEventListener('click', function () {
        window.location.href = "../src/generalBoard.html";
    });
    getAlhambraInfo();
}

document.addEventListener("DOMContentLoaded", init);

function displayTotalValue() {
    let totalValue = document.querySelector(".totalValue");
    let total = 0;
    let moneys = document.querySelectorAll(".yourMoney p");

    moneys.forEach(money => {
        console.log(money.textContent);
        total += parseInt(money.textContent);
    });

    totalValue.innerHTML = `Total value: ${total}`
}


function getAlhambraInfo(){
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            givePlayerMoney(response);
            displayTotalValue();
            setInterval(displayTotalValue, 3000)
        });
}
