"use strict";
let bankMoney = document.querySelector('.money');
let playerMoney = document.querySelector('.yourMoney')

document.addEventListener("DOMContentLoaded", init);

function init(){
    getStartGameInfo();

}
function getStartGameInfo(){
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            console.log(response);
            giveBankMoney(response);
            givePlayerMoney(response);
        });
}

function giveBankMoney(response) {
    bankMoney.innerHTML = "";
    for (let i = 0; i < response.bank.length; i ++) {
        bankMoney.innerHTML += `<p class="${response.bank[i].currency}">${response.bank[i].amount}</p>`;
    }
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
