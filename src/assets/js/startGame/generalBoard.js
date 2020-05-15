"use strict";

const GOTOALHAMBRA = document.querySelector('.navigate');
const GOTOGAMERULES = document.querySelector('.showGameRules');
const MARKETBUILDINGS = document.querySelectorAll('.buildings p');
const AUDIO = document.getElementById("myAudio");
const TAKEBUTTON = document.querySelector('.money .button');
let getInfoInterval = null;
let beepNeeded = true;

const POPUPNOTYOURTURN = document.querySelector('.popupNotYourTurn');
const POPUPNOTENOUGHMONEY = document.querySelector('.popupNotEnoughMoney');
const POPUPTOBUY = document.querySelector('.popupToBuy');
const POPUPTOPLACE = document.querySelector('.popupToPlace');
const POPUPMAXVALUE = document.querySelector('.popupMaxValue');

const CLOSENOTYOURTURN = document.querySelector('.popupNotYourTurn .close');
const CLOSENOTENOUGHMONEY = document.querySelector('.popupNotEnoughMoney .close');
const CLOSETOBUY = document.querySelector('.popupToBuy .close');
const CLOSEMAXVALUE = document.querySelector('.popupMaxValue .close');

function init(){
    GOTOALHAMBRA.addEventListener('click', function() {
        window.location.href = "../src/myAlhambraIndex.html";
    });

    GOTOGAMERULES.addEventListener('click', function() {
        window.location.href = '../src/rules.html';
    });

    MARKETBUILDINGS.forEach(building => {
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
                        showPopupNotYourTurn();
                    }
                });
        });
    });

    CLOSETOBUY.addEventListener('click', hidePopupToBuy);
    CLOSENOTYOURTURN.addEventListener('click', hidePopupNotYourTurn);
    CLOSENOTENOUGHMONEY.addEventListener('click', hidePopupNotEnoughMoney);
    CLOSEMAXVALUE.addEventListener('click', hidePopupMaxValue);

    TAKEBUTTON.addEventListener('click', takeMoney);

    getStartGameInfo();
    getInfoInterval = setInterval(getStartGameInfo, 3000);
}
document.addEventListener("DOMContentLoaded", init);


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

    POPUPTOBUY.classList.remove('hidden');

    let buyButton = document.querySelector('.popupToBuy input[type="submit"]');
    buyButton.addEventListener('click', (e2) => {e2.preventDefault();buyBuilding(e);});
}

function hidePopupToBuy() {
    POPUPTOBUY.classList.add('hidden');
}

function showPopupToPlace() {
    let inReserveButton = document.querySelector('.popupToPlace .inReserve');
    let inAlhambra = document.querySelector('.popupToPlace .inAlhambra');
    inReserveButton.addEventListener('click', placeInReserve);
    inAlhambra.addEventListener('click', placeInAlhambra);

    POPUPTOPLACE.classList.remove('hidden');
}

function hidePopupToPlace() {
    POPUPTOPLACE.classList.add('hidden');
}

function showPopupNotEnoughMoney() {
    POPUPNOTENOUGHMONEY.classList.remove('hidden');
}

function hidePopupNotEnoughMoney() {
    POPUPNOTENOUGHMONEY.classList.add('hidden');
}

function showPopupNotYourTurn() {
    POPUPNOTYOURTURN.classList.remove('hidden');
}

function hidePopupNotYourTurn() {
    POPUPNOTYOURTURN.classList.add('hidden');
}

function showPopupMaxValue() {
    POPUPMAXVALUE.classList.remove('hidden');
}

function hidePopupMaxValue() {
    POPUPMAXVALUE.classList.add('hidden');
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
        showPopupNotEnoughMoney();
    }
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
    MARKETBUILDINGS.forEach(building => {
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
                showPopupNotYourTurn();
            }
        });
    });
}

function playAudio() {
    AUDIO.play();
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
        TAKEBUTTON.classList.add('hidden');
    } else {
        TAKEBUTTON.classList.remove('hidden');
    }
}

function takeMoney() {
    let gameId = localStorage.getItem('gameId');
    let username = localStorage.getItem('username');
    if (totalTakenMoneyValue > 5 && body.length > 1) {
        showPopupMaxValue();
    } else {
        fetchFromServer(`${config.root}games/${gameId}/players/${username}/money`, 'POST', body)
            .then(function () {
                TAKEBUTTON.classList.add('hidden');
                body = [];
                totalTakenMoneyValue = 0;
                getStartGameInfo();
                getInfoInterval = setInterval(getStartGameInfo, 3000);
                beepNeeded = true;
            });
    }
}
