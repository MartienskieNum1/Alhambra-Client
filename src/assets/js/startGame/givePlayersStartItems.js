"use strict";
let bankMoney = document.querySelector('.money');

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
        });
}

function giveBankMoney(response) {
    bankMoney.innerHTML = "";

    for (let i = 0; i < response.bank.length; i ++) {
        bankMoney.innerHTML += `<p class="${response.bank[i].currency}">${response.bank[i].amount}</p>`;
    }

}

