"use strict";

let goToAlhambra = document.querySelector('.navigate');
let goToGameRules = document.querySelector('.showGameRules');
let marketBuildings = document.querySelectorAll('.buildings p');
let popupToBuy = document.querySelector('.popupToBuy');
let popupToPlace = document.querySelector('.popupToPlace');
let closeElement = document.querySelector('.close');
let audio  =  document.getElementById("myAudio");
let takeButton = document.querySelector('.money .button');
let getInfoInterval = null;
let beepNeeded = true;
let popupNotYourTurn = document.querySelector('.popupNotYourTurn');
let popupNotEnoughMoney = document.querySelector('.popupNotEnoughMoney');
let popupElement = document.querySelector('div .popup');

function init(){
    goToAlhambra.addEventListener('click', function() {
        window.location.href = "../src/myAlhambraIndex.html";
    });

    goToGameRules.addEventListener('click', function() {
        window.location.href = '../src/rules.html';
    });

    marketBuildings.forEach(building => {
        building.addEventListener('click', (e) => {
            let username = localStorage.getItem('username');
            let gameId = localStorage.getItem('gameId');
            let currentPlayer = "";
            fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
                function (response) {
                    currentPlayer = response.currentPlayer.valueOf();
                    if (currentPlayer === username) {
                        showPopupToBuy(e);
                    } else {
                        // alert("It\'s not your turn!");
                        showPopupNotYourTurn();
                    }
                });
        });
    });

        closeElement.addEventListener('click', () => popupElement.classList.add('hidden'));
        // closeElement.addEventListener('click', hidePopupToBuy);
        //
        // closeElement.addEventListener('click', hidePopupNotYourTurn);
        //
        // closeElement.addEventListener('click', hidePopupNotEnoughMoney);


    takeButton.addEventListener('click', takeMoney);

    getStartGameInfo();
    getInfoInterval = setInterval(getStartGameInfo, 3000);
}
document.addEventListener("DOMContentLoaded", init);

function showPopupNotYourTurn(){
    popupNotYourTurn.classList.remove('hidden');
}

let bankMoney = document.querySelector('.money .flex-container');
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
    buyButton.addEventListener('click', (e2) => {e2.preventDefault();buyBuilding(e);});
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
    let body = {
        "currency": e.target.getAttribute('data-color'),
        "coins": []
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
                });
            }
        });
        fetchFromServer(`${config.root}games/${gameId}/players/${username}/buildings-in-hand`, 'POST', body)
            .then(getStartGameInfo);
        hidePopupToBuy();
        showPopupToPlace();
    } else {
        // alert('You don\'t have enough money');
        showPopupNotEnoughMoney();
    }
}

function showPopupNotEnoughMoney() {
    popupNotEnoughMoney.classList.remove('hidden');
}

function placeInReserve() {
    useBuildingInHand(null);
    hidePopupToPlace();
    beepNeeded = true;
}

function getStartGameInfo() {
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
    for (let i = 0; i < response.bank.length; i++) {
        bankMoney.innerHTML += `<p class="${response.bank[i].currency}">${response.bank[i].amount}</p>`;
    }

    let allBankMoney = document.querySelectorAll('.money p');
    let username = localStorage.getItem('username');
    allBankMoney.forEach(money => {
        money.addEventListener('click', function (e) {
            if (username === currentPlayer) {
                selectMoney(e);
            } else {
                alert("It's not your turn!");
            }
        });
    });
}

function playAudio() {
    audio.play();
}

function showActivePlayer(response) {
    let currentPlayer = response.currentPlayer.valueOf();
    activePlayer.innerHTML = `Currently at play:<br>${currentPlayer}`;
    let username = localStorage.getItem('username');
    if (currentPlayer === username) {
        activePlayer.innerHTML = `Currently at play:<br>YOU`;
        if (beepNeeded) {
            playAudio();
            beepNeeded = false;
        }
    }
}

let body = [];
let totalTakenMoneyValue = 0;
function selectMoney(e) {
    clearInterval(getInfoInterval);
    getInfoInterval = null;
    let currency = e.target.classList.item(0);
    let amount = parseInt(e.target.innerHTML);

    if (e.target.classList.contains('selected')) {
        for (let moneyI in body) {
            if (body[moneyI].currency === currency && body[moneyI].amount === amount) {
                body.splice(moneyI, 1);
            }
        }
        totalTakenMoneyValue -= amount;
        e.target.classList.remove('selected');
    } else {
        body.push({
            "currency": currency,
            "amount": amount
        });
        totalTakenMoneyValue += amount;
        e.target.classList.add('selected');
    }

    if (body.length === 0) {
        takeButton.classList.add('hidden');
    } else {
        takeButton.classList.remove('hidden');
    }
}

function takeMoney() {
    let gameId = localStorage.getItem('gameId');
    let username = localStorage.getItem('username');
    if (totalTakenMoneyValue > 5 && body.length > 1) {
        alert("You went over the max value of 5 while taking multiple cards!");
    } else {
        fetchFromServer(`${config.root}games/${gameId}/players/${username}/money`, 'POST', body)
            .then(function () {
                takeButton.classList.add('hidden');
                body = [];
                totalTakenMoneyValue = 0;
                getStartGameInfo();
                getInfoInterval = setInterval(getStartGameInfo, 3000);
                beepNeeded = true;
            });
    }
}
