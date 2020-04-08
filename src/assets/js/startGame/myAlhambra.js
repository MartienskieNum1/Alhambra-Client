"use strict";

let goBack = document.querySelector('.back');
let reserveUl = document.querySelector('#reserve');

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

function closeNav() {
    document.getElementById("allPlayers").style.height = "0";
}

function openNav() {
    document.getElementById("allPlayers").style.height = "250px";
    let closeBtn = document.querySelector(".closebtn");
    closeBtn.addEventListener('click', closeNav);
}

let openBtn = document.querySelector('.showAllPlayers');
openBtn.addEventListener('click', openNav);

function loadAllPlayers(response) {
    let playerList = document.querySelector("#allPlayers");
    for (let player of response.players) {
        playerList.innerHTML = playerList.innerHTML + `<a href="#" data-username="${player.name}" class="player">${player.name}</a>`
    }
    let players = document.querySelectorAll(".player");
    players.forEach(player => {
        player.addEventListener('click', (e) => showThisAlhambra(e, response))
    })
}

function showThisAlhambra(e, response) {
    e.preventDefault();
    let username = e.target.getAttribute("data-username");
    console.log("tis gelukt");
    console.log(username);
    let myReserve;
    for (let player of response.players) {
        if (player.name === username) {
            myReserve = player.reserve;
        }
    }

    let totalValue = document.querySelector(".totalValue");
    let total = 0;
    let moneys = document.querySelectorAll(".yourMoney p");

    moneys.forEach(money => {
        total += parseInt(money.textContent);
    });

    totalValue.innerHTML = `Total value: ${total}`;

    playerMoney.innerHTML = "";

    for (let i = 0; i < response.players.length; i ++) {
        if(response.players[i].name === username){
            for (let j = 0; j < response.players[i].coins.length; j ++){
                playerMoney.innerHTML += `<p class="${response.players[i].coins[j].currency}">${response.players[i].coins[j].amount}</p>`;
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
            loadAllPlayers(response);
        });
}
