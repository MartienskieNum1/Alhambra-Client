"use strict";

const GOBACK = document.querySelector('.back');
const RESERVEUL = document.querySelector('#reserve');
const SCOREBOARDBODY = document.querySelector('#scoreboard tbody');
const AUDIO =  document.getElementById("myAudio");
let beepNeeded = true;

function init(){
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
        useBuildingInHand(null);
        setTimeout(() => location.reload(), 500);
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
    let totalValue = document.querySelector(".totalValue");
    let total = 0;
    let moneys = document.querySelectorAll(".yourMoney p");

    moneys.forEach(money => {
        total += parseInt(money.textContent);
    });

    totalValue.innerHTML = `Total value: ${total}`;
}

function populateReserveAndListeners(response) {
    let username = localStorage.getItem('username');
    let myReserve;
    for (let player of response.players) {
        if (player.name === username) {
            myReserve = player.reserve;
        }
    }

    RESERVEUL.innerHTML = "";
    for (let building of myReserve) {
        RESERVEUL.innerHTML += `<li class="${building.type}" data-value="${building.cost}">${building.cost}</li>`;
        for (let [key, value] of Object.entries(building.walls)) {
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
        let building = {
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
            for (let key in building.walls) {
                if (e.target.classList.item(i) === key) {
                    building.walls[key] = true;
                }
            }
        }
        localStorage.setItem('building', JSON.stringify(building));
        e.target.classList.add('selected');
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
        playerList.innerHTML = playerList.innerHTML + `<a href="#" data-username="${player.name}" class="player">${player.name}</a>`;
    }
    let players = document.querySelectorAll(".player");
    players.forEach(player => {
        player.addEventListener('click', (e) => showThisAlhambra(e, response));
    });
}

function showBuildingInHand(response) {
    let hand = document.querySelector("#buildingInHand");
    let username = localStorage.getItem('username');
    let building;
    hand.innerHTML = `<p>Building in your hand:</p>
                        <p>You have no building in your hand</p>`;
    for (let player of response.players) {
        if (player.name === username) {
            building = player["buildings-in-hand"][0];
            if (player["buildings-in-hand"].length > 0){
                hand.innerHTML = ``;
                hand.innerHTML += `<p>Building in your hand:</p>`;
                hand.innerHTML += `<p class="${building.type}">${building.cost}</p>`;
                for (let [key, value] of Object.entries(building.walls)) {
                    if (value) {
                        hand.lastElementChild.classList.add(key);
                    }
                }
            }
        }
    }
}

function showThisAlhambra(e, response) {
    e.preventDefault();
    let username = e.target.getAttribute("data-username");
    let myReserve;
    for (let player of response.players) {
        if (player.name === username) {
            myReserve = player.reserve;
        }
    }

    let columns = 11;
    let city = document.querySelector(".city");
    city.innerHTML = "";
    for (let i = 0;i < columns;i++){
        for (let j = 0;j < columns;j++){
            city.innerHTML += `<div class="buildingInAlhambra" data-row="${Math.round(i-columns/2)}"
            data-column="${Math.round(j-columns/2)}"></div>`;
        }
    }

    let gameId = localStorage.getItem('gameId');
    let divs = document.querySelectorAll(".buildingInAlhambra");
    let totalRows = 0;
    let myCity;
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then((response) => {
        for (let player of response.players) {
            if (player.name === username) {
                myCity = player.city;
            }
        }

        for (let row in myCity) {
            totalRows++;
        }

        for (let rowIn in myCity) {
            for (let colIn in myCity[rowIn]) {
                if (myCity[rowIn][colIn]) {
                    let building = myCity[rowIn][colIn];
                    divs.forEach(div => {
                        let divRow = parseInt(div.getAttribute('data-row'));
                        let divCol = parseInt(div.getAttribute('data-column'));
                        let buildingRow = Math.round(rowIn - totalRows / 2);
                        let buildingCol = Math.round(colIn - totalRows / 2);
                        if (divRow === buildingRow && divCol === buildingCol) {
                            if (!building.type) {
                                div.innerHTML = `<p class="fountain"></p>`;
                            } else {
                                div.innerHTML = `<p class="${building.type}">${building.cost}</p>`;
                                for (let [key, value] of Object.entries(building.walls)) {
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
    for (let building of myReserve) {
        RESERVEUL.innerHTML += `<li class="${building.type}">${building.cost}</li>`;
        for (let [key, value] of Object.entries(building.walls)) {
            if (value) {
                RESERVEUL.lastElementChild.classList.add(key);
            }
        }
    }

    playerMoney.innerHTML = "";

    for (let i = 0; i < response.players.length; i ++) {
        if(response.players[i].name === username){
            for (let j = 0; j < response.players[i].coins.length; j ++){
                playerMoney.innerHTML += `<p class="${response.players[i].coins[j].currency}">${response.players[i].coins[j].amount}</p>`;
            }
        }
    }

    let totalValue = document.querySelector(".totalValue");
    let total = 0;
    let moneys = document.querySelectorAll(".yourMoney p");

    moneys.forEach(money => {
        total += parseInt(money.textContent);
    });

    totalValue.innerHTML = `Total value: ${total}`;

}

function displayScores(response) {
    SCOREBOARDBODY.innerHTML = "";
    for (let player of response.players) {
        SCOREBOARDBODY.innerHTML += `
            <tr>
                <td>${player.name}</td>
                <td>${player.score}</td>
                <td>${player["virtual-score"]}</td>
            </tr>`;
    }
}

function getAlhambraInfo() {
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
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
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            console.log(response);
            let currentPlayer = response.currentPlayer.valueOf();
            let username = localStorage.getItem('username');
            if (currentPlayer === username) {
                if (beepNeeded) {
                    AUDIO.play();
                    beepNeeded = false;
                }
            }
        });
}
