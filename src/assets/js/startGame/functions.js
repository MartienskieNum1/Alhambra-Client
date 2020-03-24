"use strict";

let bankMoney = document.querySelector('.money');
let playerMoney = document.querySelector('.yourMoney');
let buildingMarket = document.querySelector('.buildings');



function getStartGameInfo(){
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            console.log(response);
            giveBankMoney(response);
            givePlayerMoney(response);
            populateBuildingMarket(response);
        });
}

function getAlhambraInfo(){
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            console.log(response);
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

function populateBuildingMarket(response) {
    buildingMarket.innerHTML = "";

    buildingMarket.innerHTML = `<p class="${response.market.blue.type}"><img src="../../media/blue.png" alt="blue">
    ${response.market.blue.cost}</p>`;

    buildingMarket.innerHTML += `<p class="${response.market.green.type}"><img src="../../media/green.png" alt="green">
    ${response.market.green.cost}</p>`;

    buildingMarket.innerHTML += `<p class="${response.market.orange.type}"><img src="../../media/orange.png" alt="orange">
    ${response.market.orange.cost}</p>`;

    buildingMarket.innerHTML += `<p class="${response.market.yellow.type}"><img src="../../media/orange.png" alt="yellow">
    ${response.market.yellow.cost}</p>`;

    console.log(response.market.yellow.type);
    console.log("test");
}
