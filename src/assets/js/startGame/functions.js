"use strict";

let bankMoney = document.querySelector('.money');
let playerMoney = document.querySelector('.yourMoney');
let marketBuildings = document.querySelectorAll('.buildings p');
let activePlayer = document.querySelector('.currentPlayer');

function takeMoney(e) {
    let currency = e.target.className;
    let amount = parseInt(e.target.innerHTML);
    let gameId = localStorage.getItem('gameId');
    let username = localStorage.getItem('username');
    let body = [
        {
            "currency": currency,
            "amount": amount
        }
    ];
    console.log(body);
    fetchFromServer(`${config.root}games/${gameId}/players/${username}/money`, 'POST', body)
        .then(function () {
            getStartGameInfo();
        })
}

function getStartGameInfo(){
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            console.log(response);
            populateBuildingMarket(response);
            giveBankMoney(response);
            givePlayerMoney(response);
            showActivePlayer();
            setInterval(function (){showActivePlayer()}, 3000);
        });
}

function getAlhambraInfo(){
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            givePlayerMoney(response);
        });
}

function giveBankMoney(response) {
    bankMoney.innerHTML = "";
    for (let i = 0; i < response.bank.length; i ++) {
        bankMoney.innerHTML += `<p class="${response.bank[i].currency}">${response.bank[i].amount}</p>`;
    }

    let allBankMoney = document.querySelectorAll('.money p');
    allBankMoney.forEach(money => {
        money.addEventListener('click', takeMoney);
    });
}

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

function showActivePlayer() {
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function(response) {
            let currentPlayer = response.currentPlayer.valueOf();
            activePlayer.innerHTML = `Currently at play:<br>${currentPlayer}`;
            let username = localStorage.getItem('username');

            if (currentPlayer === username){
                activePlayer.innerHTML = `Currently at play:<br>YOU`;
            }
        }
    );
}

function populateBuildingMarket(response) {

    marketBuildings.forEach(building => {
        for (let [key, value] of Object.entries(response.market)) {
            let color = building.getAttribute('data-color');
            if (color === key) {
                building.className = `${value.type}`;
                building.innerHTML = `${value.cost} <img src="assets/media/${color}.png" alt="${color}"/>`;
            }
        }
    });
}
