"use strict";

let goToAlhambra = document.querySelector('.navigate');
let goToGameRules = document.querySelector('.showGameRules');
let marketBuildings = document.querySelectorAll('.buildings p');
let popupToBuy = document.querySelector('.popupToBuy');
let popupToPlace = document.querySelector('.popupToPlace');
let closeElement = document.querySelector('.close');

function init(){
    goToAlhambra.addEventListener('click', function() {
        window.location.href = "../src/myAlhambraIndex.html";
    });

    goToGameRules.addEventListener('click', function() {
        window.location.href = '../src/rules.html';
    });

    marketBuildings.forEach(building => {
        building.addEventListener('click', (e) => {showPopupToBuy(e)})
    });

    closeElement.addEventListener('click', hidePopupToBuy);

    getStartGameInfo();
    setInterval(getStartGameInfo, 3000);
}
document.addEventListener("DOMContentLoaded", init);

let bankMoney = document.querySelector('.money');
let activePlayer = document.querySelector('.currentPlayer');

function showPopupToBuy(e) {
    console.log(e.target);
    let yourMoneys = document.querySelectorAll('.yourMoney p');
    let moneyForm = document.querySelector('.popupToBuy form');

    moneyForm.innerHTML = "";
    yourMoneys.forEach(money => {
        if (money.className === e.target.getAttribute('data-color')) {
            moneyForm.innerHTML += `
            <label>
                <input type="checkbox" data-color="${money.className}" data-value="${money.innerHTML}"/>
            ${money.className} (${money.innerHTML})</label>`;
        }
    });
    moneyForm.innerHTML += '<input type="submit" value="Buy"/>';

    popupToBuy.classList.remove('hidden');

    let buyButton = document.querySelector('.popupToBuy input[type="submit"]');
    buyButton.addEventListener('click', (e2) => {e2.preventDefault(); buyBuilding(e)})
}

function showPopupToPlace() {
    let inReserveButton = document.querySelector('.popupToPlace .inReserve');
    let inAlhambra = document.querySelector('.popupToPlace .inAlhambra');
    inReserveButton.addEventListener('click', placeInReserve);
    inAlhambra.addEventListener('click', placeInAlhambra);

    popupToPlace.classList.remove('hidden');
}

function hidePopupToBuy() {
    popupToBuy.classList.add('hidden');
}

function hidePopupToPlace() {
    popupToPlace.classList.add('hidden');
}

function buyBuilding(e) {
    let username = localStorage.getItem('username');
    let gameId = localStorage.getItem('gameId');
    let checkboxes = document.querySelectorAll('.popup input[type="checkbox"]');
    let currentPlayer = "";
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            currentPlayer = response.currentPlayer.valueOf();
            if (currentPlayer === username) {
                let body = {
                    "currency": e.target.getAttribute('data-color'),
                    "coins" : []
                };

                let totalAmount = 0;
                checkboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        totalAmount += parseInt(checkbox.getAttribute('data-value'));
                    }
                });

                if (totalAmount >= e.target.getAttribute('data-value')) {
                    console.log(totalAmount, e.target.getAttribute(totalAmount));
                    checkboxes.forEach(checkbox => {
                        if (checkbox.checked) {
                            body.coins.push({
                                "currency": checkbox.getAttribute('data-color'),
                                "amount": checkbox.getAttribute('data-value')
                            })
                        }
                    });

                    fetchFromServer(`${config.root}games/${gameId}/players/${username}/buildings-in-hand`, 'POST', body)
                        .then(getStartGameInfo);
                    hidePopupToBuy();
                    showPopupToPlace();
                } else {
                    alert('You don\'t have enough money');
                }
            }else {
                alert('It\'s not your turn!');
            }
        });
}

function placeInReserve() {
    let gameId = localStorage.getItem('gameId');
    let username = localStorage.getItem('username');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            let building;
            for (let player of response.players) {
                if (player.name === username) {
                    building = player["buildings-in-hand"][0];
                }
            }
            let body = {
                "building": building,
                "location": null
            };
            fetchFromServer(`${config.root}games/${gameId}/players/${username}/city`, 'POST', body).then(
                function () {
                    getStartGameInfo();
                    hidePopupToPlace();
                }
            )
        });
    hidePopupToPlace();
}

function placeInAlhambra() {

}

function getStartGameInfo(){
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            console.log(response);
            populateBuildingMarket(response);
            giveBankMoney(response);
            givePlayerMoney(response);
            showActivePlayer(response);
        });
}

function populateBuildingMarket(response) {
    marketBuildings.forEach(building => {
        let color = building.getAttribute('data-color');
        for (let [key1, value1] of Object.entries(response.market)) {
            if (color === key1) {
                if (value1 === null) {
                    building.className = "";
                    building.innerHTML = `Taken <img src="assets/media/${color}.png" alt="${color}"/>`;
                } else {
                    building.className = `${value1.type}`;

                    for (let [key2, value2] of Object.entries(value1.walls)) {
                        if (value2) {
                            building.classList.add(key2);
                        }
                    }
                    building.innerHTML = `${value1.cost}<img src="assets/media/${color}.png" alt="${color}"/>`;
                    building.setAttribute('data-value', value1.cost);
                }
            }
        }
    });
}

function giveBankMoney(response) {
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
    })
}

function showActivePlayer(response) {
    let currentPlayer = response.currentPlayer.valueOf();
    activePlayer.innerHTML = `Currently at play:<br>${currentPlayer}`;
    let username = localStorage.getItem('username');

    if (currentPlayer === username){
        activePlayer.innerHTML = `Currently at play:<br>YOU`;
    }
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
