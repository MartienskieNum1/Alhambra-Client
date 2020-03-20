"use strict";

let playerMoney = document.querySelector('.yourMoney');

function init(){
    getStartGameInfo();

}

function getStartGameInfo(){
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            console.log(response);
            givePlayerMoney(response);
        });
}

function givePlayerMoney(response) {
    let username = localStorage.getItem('username');
    playerMoney.innerHTML = "";

    for (let i = 0; i < response.players.length; i ++) {
        if(response.players[i].name === username){
            for (let j = 0; response.players[i].coins.length; j ++){
                console.log(username);
                playerMoney.innerHTML += `<p class="${response.players[i].coins[j].currency}">${response.players[i].coins[j].amount}</p>`;
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", init);
