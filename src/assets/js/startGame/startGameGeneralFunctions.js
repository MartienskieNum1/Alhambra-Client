"use strict";

let playerMoney = document.querySelector('.yourMoney');

function givePlayerMoney(response) {
    let username = localStorage.getItem('username');
    playerMoney.innerHTML = "";

    for (let i = 0; i < response.players.length; i ++) {
        if(response.players[i].name === username){
            for (let j = 0; j < response.players[i].coins.length; j ++){
                playerMoney.innerHTML += `<p class="${response.players[i].coins[j].currency}">${response.players[i].coins[j].amount}</p>`;
            }
        }
    }
}

function placeInAlhambra() {
    window.location.href = '../src/myAlhambraIndex.html';
    //get locatie
    let divElements = document.querySelectorAll('.buildingInAlhambra');
    let column, row;

    divElements.forEach(div => {
        div.addEventListener("click", function (e) {
            console.log(e.target);
        })
    });
    useBuildingInHand();
}
