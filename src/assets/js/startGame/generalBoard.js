"use strict";

const GOTOALHAMBRA = document.querySelector('.navigate');
const GOTOGAMERULES = document.querySelector('.showGameRules');
//const GOTOVICTORYSCREEN = document.querySelector('.back');
const MARKETBUILDINGS = document.querySelectorAll('.buildings p');
const AUDIO = document.getElementById("myAudio");
const TAKEBUTTON = document.querySelector('.money .button');
const AMOUNTOFREMAININGBUILDINGS = document.querySelector('.buildings .amountOfRemainingBuildings');
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

    /*GOTOVICTORYSCREEN.addEventListener('click', function() {
        window.location.href = '../src/victory.html';
    });
*/
    MARKETBUILDINGS.forEach(building => {
        building.addEventListener('click', (e) => {
            const USERNAME = localStorage.getItem('username');
            const GAMEID = localStorage.getItem('gameId');
            let currentPlayer = "";
            fetchFromServer(`${config.root}games/${GAMEID}`, 'GET').then(
                function (response) {
                    currentPlayer = response.currentPlayer.valueOf();
                    if (currentPlayer === USERNAME) {
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

    lastScoreRound();
}
document.addEventListener("DOMContentLoaded", init);

const BANKMONEY = document.querySelector('.money .flex-container');
const ACTIVEPLAYER = document.querySelector('.currentPlayer');

function showPopupToBuy(e) {
    console.log(e.target);
    const YOURMONEYS = document.querySelectorAll('.yourMoney p');
    const MONEYFORM = document.querySelector('.popupToBuy form');

    MONEYFORM.innerHTML = "";
    YOURMONEYS.forEach(money => {
        if (money.className === e.target.getAttribute('data-color')) {
            MONEYFORM.innerHTML += `
            <label>
                <input type="checkbox" data-color="${money.className}" data-value="${money.innerHTML}"/>
            ${money.className} (${money.innerHTML})</label>`;
        }
    });
    MONEYFORM.innerHTML += '<input type="submit" value="Buy"/>';

    POPUPTOBUY.classList.remove('hidden');

    const BUYBUTTON = document.querySelector('.popupToBuy input[type="submit"]');
    BUYBUTTON.addEventListener('click', (e2) => {e2.preventDefault();buyBuilding(e);});
}

function hidePopupToBuy() {
    POPUPTOBUY.classList.add('hidden');
}

function showPopupToPlace() {
    const INRESERVEBUTTON = document.querySelector('.popupToPlace .inReserve');
    const INALHAMBRA = document.querySelector('.popupToPlace .inAlhambra');
    INRESERVEBUTTON.addEventListener('click', placeInReserve);
    INALHAMBRA.addEventListener('click', placeInAlhambra);

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
    const USERNAME = localStorage.getItem('username');
    const GAMEID = localStorage.getItem('gameId');
    const CHECKBOXES = document.querySelectorAll('.popup input[type="checkbox"]');
    const BODY = {
        "currency": e.target.getAttribute('data-color'),
        "coins": []
    };

    let totalAmount = 0;
    CHECKBOXES.forEach(checkbox => {
        if (checkbox.checked) {
            totalAmount += parseInt(checkbox.getAttribute('data-value'));
        }
    });

    if (totalAmount >= e.target.getAttribute('data-value')) {
        console.log(totalAmount, e.target.getAttribute(totalAmount));
        CHECKBOXES.forEach(checkbox => {
            if (checkbox.checked) {
                BODY.coins.push({
                    "currency": checkbox.getAttribute('data-color'),
                    "amount": checkbox.getAttribute('data-value')
                });
            }
        });
        fetchFromServer(`${config.root}games/${GAMEID}/players/${USERNAME}/buildings-in-hand`, 'POST', BODY)
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
    const GAMEID = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${GAMEID}`, 'GET').then(
        function (response) {
            console.log(response);
            populateBuildingMarket(response);
            giveBankMoney(response);
            givePlayerMoney(response);
            showActivePlayer(response);
            getAmountOfRemainingBuildings(response);
            lastScoreRound(response);
        });
}

function populateBuildingMarket(response) {
    MARKETBUILDINGS.forEach(building => {
        const COLOR = building.getAttribute('data-color');
        for (let [key1, value1] of Object.entries(response.market)) {
            if (COLOR === key1) {
                if (value1 === null) {
                    building.className = "";
                    building.innerHTML = `Taken <img src="assets/media/${COLOR}.png" alt="${COLOR}"/>`;
                } else {
                    building.className = `${value1.type}`;

                    for (let [key2, value2] of Object.entries(value1.walls)) {
                        if (value2) {
                            building.classList.add(key2);
                        }
                    }
                    building.innerHTML = `${value1.cost}<img src="assets/media/${COLOR}.png" alt="${COLOR}"/>`;
                    building.setAttribute('data-value', value1.cost);
                }
            }
        }
    });
}

function giveBankMoney(response) {
    const CURRENTPLAYER = response.currentPlayer.valueOf();
    BANKMONEY.innerHTML = "";
    for (let i = 0; i < response.bank.length; i++) {
        BANKMONEY.innerHTML += `<p class="${response.bank[i].currency}">${response.bank[i].amount}</p>`;
    }

    const ALLBANKMONEY = document.querySelectorAll('.money p');
    const USERNAME = localStorage.getItem('username');
    ALLBANKMONEY.forEach(money => {
        money.addEventListener('click', function (e) {
            if (USERNAME === CURRENTPLAYER) {
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
    const CURRENTPLAYER = response.currentPlayer.valueOf();
    ACTIVEPLAYER.innerHTML = `Currently at play:<br>${CURRENTPLAYER}`;
    const USERNAME = localStorage.getItem('username');
    if (CURRENTPLAYER === USERNAME) {
        ACTIVEPLAYER.innerHTML = `Currently at play:<br>YOU`;
        if (beepNeeded) {
            playAudio();
            beepNeeded = false;
        }
    }
}

function getAmountOfRemainingBuildings(response){
    const AMOUNTOFBUILDINGS = response.remainingBuildings.valueOf();
    AMOUNTOFREMAININGBUILDINGS.innerHTML = `There are ${AMOUNTOFBUILDINGS} buildings remaining`;

}

let body = [];
let totalTakenMoneyValue = 0;
function selectMoney(e) {
    clearInterval(getInfoInterval);
    getInfoInterval = null;
    const CURRENCY = e.target.classList.item(0);
    const AMOUNT = parseInt(e.target.innerHTML);

    if (e.target.classList.contains('selected')) {
        for (const MONEYI in body) {
            if (body[MONEYI].currency === CURRENCY && body[MONEYI].amount === AMOUNT) {
                body.splice(MONEYI, 1);
            }
        }
        totalTakenMoneyValue -= AMOUNT;
        e.target.classList.remove('selected');
    } else {
        body.push({
            "currency": CURRENCY,
            "amount": AMOUNT
        });
        totalTakenMoneyValue += AMOUNT;
        e.target.classList.add('selected');
    }

    if (body.length === 0) {
        TAKEBUTTON.classList.add('hidden');
    } else {
        TAKEBUTTON.classList.remove('hidden');
    }
}

function takeMoney() {
    const GAMEID = localStorage.getItem('gameId');
    const USERNAME = localStorage.getItem('username');
    if (totalTakenMoneyValue > 5 && body.length > 1) {
        showPopupMaxValue();
    } else {
        fetchFromServer(`${config.root}games/${GAMEID}/players/${USERNAME}/money`, 'POST', body)
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
//
// function lastScoreRound() {
//     const ROUND = localStorage.getItem('round');
//     fetchFromServer(`${config.root}scoring/${ROUND}`, 'GET').then(
//         function () {
//             if(parseInt(ROUND) === 3) {
//                 window.location.href = '../src/victory.html';
//             }
//         });
// }

function lastScoreRound(response) {
    const AMOUNTOFBUILDINGS = response.remainingBuildings.valueOf();
    if (AMOUNTOFBUILDINGS === null) {
        window.location.href = '../src/victory.html';
    }
}