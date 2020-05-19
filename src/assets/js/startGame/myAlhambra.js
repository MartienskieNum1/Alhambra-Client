"use strict";

const GOBACK = document.querySelector('.back');
const RESERVEUL = document.querySelector('#reserve');
const SCOREBOARDBODY = document.querySelector('#scoreboard tbody');
const AUDIO =  document.getElementById("myAudio");
let beepNeeded = true;

function init() {
    GOBACK.addEventListener('click', function () {
        window.location.href = "../src/generalBoard.html";
        beepNeeded = true;
    });
    getAlhambraInfo();
    makeDivsAndListeners();
    beepNeeded = true;
    setInterval(checkCurrentPlayer, 3000);
}

document.addEventListener("DOMContentLoaded", init);

function makeDivsAndListeners() {
    const COLUMNS = 11;
    const CITY = document.querySelector(".city");
    CITY.innerHTML = "";
    for (let i = 0;i < COLUMNS;i++){
        for (let j = 0;j < COLUMNS;j++){
            CITY.innerHTML += `<div class="buildingInAlhambra" data-row="${Math.round(i-COLUMNS/2)}"
            data-column="${Math.round(j-COLUMNS/2)}"></div>`;
        }
    }

    insertBuildings();

    const RESERVE = document.querySelector("#reserve");
    RESERVE.addEventListener("click",(e)=>{
        if (e.target.id === "reserve") {
            useBuildingInHand(null);
            setTimeout(() => location.reload(), 500);
        }
    });

    const DIVS = document.querySelectorAll(".buildingInAlhambra");
    DIVS.forEach(div => {
        div.addEventListener("click", (e) => {
            getBuildingLocation(e);
            setTimeout(() => location.reload(), 500);
            beepNeeded = true;
        });
    });
}

function getBuildingLocation(e) {
    if (e.target.hasChildNodes()) {
        const LOCATION = {
            "row" : e.target.closest('div').getAttribute("data-row"),
            "col" : e.target.closest('div').getAttribute("data-column")
        };
        placeInReserve(LOCATION);
    } else {
        const LOCATION = {
            "row" : e.target.getAttribute("data-row"),
            "col" : e.target.getAttribute("data-column")
        };
        useBuildingInHand(LOCATION);
    }
}

function placeInReserve(location) {
    const GAMEID = localStorage.getItem('gameId');
    const USERNAME = localStorage.getItem('username');
    const BODY = {
        "location": location
    };
    console.log(BODY);
    fetchFromServer(`${config.root}games/${GAMEID}/players/${USERNAME}/city`, 'PATCH', BODY).then();
}

function insertBuildings() {
    const USERNAME = localStorage.getItem('username');
    const GAMEID = localStorage.getItem('gameId');
    const DIVS = document.querySelectorAll(".buildingInAlhambra");
    let totalRows = 0;
    let myCity;
    fetchFromServer(`${config.root}games/${GAMEID}`, 'GET').then((response) => {
        for (const PLAYER of response.players) {
            if (PLAYER.name === USERNAME) {
                    myCity = PLAYER.city;
                }
            }

        for (let row in myCity) {
            totalRows++;
        }

        for (const ROWIN in myCity) {
            for (const COLIN in myCity[ROWIN]) {
                if (myCity[ROWIN][COLIN]) {
                    const BUILDING = myCity[ROWIN][COLIN];
                    DIVS.forEach(div => {
                        const DIVROW = parseInt(div.getAttribute('data-row'));
                        const DIVCOL = parseInt(div.getAttribute('data-column'));
                        const BUILDINGROW = Math.round(ROWIN - totalRows / 2);
                        const BUILDINGCOL = Math.round(COLIN - totalRows / 2);
                        if (DIVROW === BUILDINGROW && DIVCOL === BUILDINGCOL) {
                            if (!BUILDING.type) {
                                div.innerHTML = `<p class="fountain"></p>`;
                            } else {
                                div.innerHTML = `
                                    <p class="${BUILDING.type}" data-value="${BUILDING.cost}">${BUILDING.cost}</p>`;
                                for (let [key, value] of Object.entries(BUILDING.walls)) {
                                    if (value) {
                                        div.firstElementChild.classList.add(key);
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
    });
}

function displayTotalValue() {
    const TOTALVALUE = document.querySelector(".totalValue");
    let total = 0;
    const MONEYS = document.querySelectorAll(".yourMoney p");

    MONEYS.forEach(money => {
        total += parseInt(money.textContent);
    });

    TOTALVALUE.innerHTML = `Total value: ${total}`;
}

function populateReserveAndListeners(response) {
    const USERNAME = localStorage.getItem('username');
    let myReserve;
    for (const PLAYER of response.players) {
        if (PLAYER.name === USERNAME) {
            myReserve = PLAYER.reserve;
        }
    }

    RESERVEUL.innerHTML = "";
    for (const BUILDING of myReserve) {
        RESERVEUL.innerHTML += `<li class="${BUILDING.type}" data-value="${BUILDING.cost}">${BUILDING.cost}</li>`;
        for (let [key, value] of Object.entries(BUILDING.walls)) {
            if (value) {
                RESERVEUL.lastElementChild.classList.add(key);
            }
        }
    }

    document.querySelectorAll('#reserve li').forEach(building => {
        building.addEventListener('click', (e) => selectReserve(e));
    });
}

function selectReserve(e) {
    if (e.target.classList.contains('selected')) {
        localStorage.removeItem('building');
        e.target.classList.remove('selected');
    } else {
        const BUILDING = {
            "type": e.target.classList.item(0),
            "cost": parseInt(e.target.getAttribute('data-value')),
            "walls": {
                "north": false,
                "east": false,
                "south": false,
                "west": false
            }
        };
        for (let i = 1; i < e.target.classList.length; i++) {
            for (const KEY in BUILDING.walls) {
                if (e.target.classList.item(i) === KEY) {
                    BUILDING.walls[KEY] = true;
                }
            }
        }
        localStorage.setItem('building', JSON.stringify(BUILDING));
        e.target.classList.add('selected');
    }
}

function closeNav() {
    document.getElementById("allPlayers").style.height = "0";
}

function openNav() {
    document.getElementById("allPlayers").style.height = "250px";
    const CLOSEBTN = document.querySelector(".closebtn");
    CLOSEBTN.addEventListener('click', closeNav);
}

const OPENBTN = document.querySelector('.showAllPlayers');
OPENBTN.addEventListener('click', openNav);

function loadAllPlayers(response) {
    const PLAYERLIST = document.querySelector("#allPlayers");
    for (const PLAYER of response.players) {
        PLAYERLIST.innerHTML = PLAYERLIST.innerHTML + `<a href="#" data-username="${PLAYER.name}" class="player">${PLAYER.name}</a>`;
    }
    const PLAYERS = document.querySelectorAll(".player");
    PLAYERS.forEach(player => {
        player.addEventListener('click', (e) => showThisAlhambra(e, response));
    });
}

function showBuildingInHand(response) {
    const HAND = document.querySelector("#buildingInHand");
    const USERNAME = localStorage.getItem('username');
    let building;
    HAND.innerHTML = `<p>Building in your hand:</p>
                        <p>You have no building in your hand</p>`;
    for (const PLAYER of response.players) {
        if (PLAYER.name === USERNAME) {
            building = PLAYER["buildings-in-hand"][0];
            if (PLAYER["buildings-in-hand"].length > 0){
                HAND.innerHTML = ``;
                HAND.innerHTML += `<p>Building in your hand:</p>`;
                HAND.innerHTML += `<p class="${building.type}">${building.cost}</p>`;
                for (let [key, value] of Object.entries(building.walls)) {
                    if (value) {
                        HAND.lastElementChild.classList.add(key);
                    }
                }
            }
        }
    }
}

function showThisAlhambra(e, response) {
    e.preventDefault();
    const USERNAME = e.target.getAttribute("data-username");
    let myReserve;
    for (const PLAYER of response.players) {
        if (PLAYER.name === USERNAME) {
            myReserve = PLAYER.reserve;
        }
    }

    const COLUMNS = 11;
    const CITY = document.querySelector(".city");
    CITY.innerHTML = "";
    for (let i = 0;i < COLUMNS;i++){
        for (let j = 0;j < COLUMNS;j++){
            CITY.innerHTML += `<div class="buildingInAlhambra" data-row="${Math.round(i-COLUMNS/2)}"
            data-column="${Math.round(j-COLUMNS/2)}"></div>`;
        }
    }

    const GAMEID = localStorage.getItem('gameId');
    const DIVS = document.querySelectorAll(".buildingInAlhambra");
    let totalRows = 0;
    let myCity;
    fetchFromServer(`${config.root}games/${GAMEID}`, 'GET').then((response) => {
        for (const PLAYER of response.players) {
            if (PLAYER.name === USERNAME) {
                myCity = PLAYER.city;
            }
        }

        for (let row in myCity) {
            totalRows++;
        }

        for (const ROWIN in myCity) {
            for (const COLIN in myCity[ROWIN]) {
                if (myCity[ROWIN][COLIN]) {
                    const BUILDING = myCity[ROWIN][COLIN];
                    DIVS.forEach(div => {
                        const DIVROW = parseInt(div.getAttribute('data-row'));
                        const DIVCOL = parseInt(div.getAttribute('data-column'));
                        const BUILDINGROW = Math.round(ROWIN - totalRows / 2);
                        const BUILDINGCOL = Math.round(COLIN - totalRows / 2);
                        if (DIVROW === BUILDINGROW && DIVCOL === BUILDINGCOL) {
                            if (!BUILDING.type) {
                                div.innerHTML = `<p class="fountain"></p>`;
                            } else {
                                div.innerHTML = `<p class="${BUILDING.type}">${BUILDING.cost}</p>`;
                                for (let [key, value] of Object.entries(BUILDING.walls)) {
                                    if (value) {
                                        div.firstElementChild.classList.add(key);
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
    });

    RESERVEUL.innerHTML = "";
    for (const BUILDING of myReserve) {
        RESERVEUL.innerHTML += `<li class="${BUILDING.type}">${BUILDING.cost}</li>`;
        for (let [key, value] of Object.entries(BUILDING.walls)) {
            if (value) {
                RESERVEUL.lastElementChild.classList.add(key);
            }
        }
    }

    PLAYERMONEY.innerHTML = "";

    for (let i = 0; i < response.players.length; i ++) {
        if(response.players[i].name === USERNAME){
            for (let j = 0; j < response.players[i].coins.length; j ++){
                PLAYERMONEY.innerHTML += `<p class="${response.players[i].coins[j].currency}">${response.players[i].coins[j].amount}</p>`;
            }
        }
    }

    const TOTALVALUE = document.querySelector(".totalValue");
    let total = 0;
    const MONEYS = document.querySelectorAll(".yourMoney p");

    MONEYS.forEach(money => {
        total += parseInt(money.textContent);
    });

    TOTALVALUE.innerHTML = `Total value: ${total}`;
}

function displayScores(response) {
    SCOREBOARDBODY.innerHTML = "";
    for (const PLAYER of response.players) {
        SCOREBOARDBODY.innerHTML += `
            <tr>
                <td>${PLAYER.name}</td>
                <td>${PLAYER.score}</td>
                <td>${PLAYER["virtual-score"]}</td>
            </tr>`;
    }
}

function getAlhambraInfo() {
    const GAMEID = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${GAMEID}`, 'GET').then(
        function (response) {
            console.log(response);
            givePlayerMoney(response);
            displayTotalValue();
            populateReserveAndListeners(response);
            loadAllPlayers(response);
            displayScores(response);
            showBuildingInHand(response);
        });
}

function checkCurrentPlayer() {
    const GAMEID = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${GAMEID}`, 'GET').then(
        function (response) {
            console.log(response);
            const CURRENTPLAYER = response.currentPlayer.valueOf();
            const USERNAME = localStorage.getItem('username');
            if (CURRENTPLAYER === USERNAME) {
                if (beepNeeded) {
                    AUDIO.play();
                    beepNeeded = false;
                }
            }
        });
}
