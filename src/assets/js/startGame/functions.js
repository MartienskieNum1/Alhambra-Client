"use strict";

let bankMoney = document.querySelector('.money');
let playerMoney = document.querySelector('.yourMoney');

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
    fetchFromServer(`${config.root}games/${gameId}/players/${username}/money`, 'POST', `${body}`)
        .then(function (response) {
            giveBankMoney(response);
            givePlayerMoney(response);
        })
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
            for (let j = 0; response.players[i].coins.length; j ++){
                playerMoney.innerHTML += `<p class="${response.players[i].coins[j].currency}">${response.players[i].coins[j].amount}</p>`;
            }
        }
    }
}
