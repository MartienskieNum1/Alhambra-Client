"use strict";

let goToAlhambra = document.querySelector('.navigate');
let goToGameRules = document.querySelector('.showGameRules');

function init(){
    goToAlhambra.addEventListener('click', function() {
        window.location.href = "../src/myAlhambraIndex.html";
    });

    goToGameRules.addEventListener('click', function() {
        window.location.href = '../src/rules.html';
    });

    getStartGameInfo();
}
document.addEventListener("DOMContentLoaded", init);

let bankMoney = document.querySelector('.money');
let marketBuildings = document.querySelectorAll('.buildings p');
let activePlayer = document.querySelector('.currentPlayer');

function getStartGameInfo(){
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            console.log(response);
            populateBuildingMarket(response);
            giveBankMoney();
            givePlayerMoney(response);
            showActivePlayer();
            setInterval(showActivePlayer, 3000);
            setInterval(giveBankMoney, 3000)
        });
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

function giveBankMoney() {
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function(response) {
            let currentPlayer = response.currentPlayer.valueOf();
            bankMoney.innerHTML = "";
            for (let i = 0; i < response.bank.length; i ++) {
                bankMoney.innerHTML += `<p class="${response.bank[i].currency}">${response.bank[i].amount}</p>`;
            }

            let allBankMoney = document.querySelectorAll('.money p');
            let username = localStorage.getItem('username');
            allBankMoney.forEach(money => {
                money.addEventListener('click', function(e){
                    if (username === currentPlayer) {
                        takeMoney(e);
                    }else {
                        alert("It's not your turn!");
                    }
                });
            });
        });
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
