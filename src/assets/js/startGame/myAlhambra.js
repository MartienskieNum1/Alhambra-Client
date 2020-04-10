"use strict";

let goBack = document.querySelector('.back');
let reserveUl = document.querySelector('#reserve');
let scoreboardBody = document.querySelector('#scoreboard tbody');

function init(){
    goBack.addEventListener('click', function () {
        window.location.href = "../src/generalBoard.html";
    });
    getAlhambraInfo();
    makeDivsAndListeners();
}

document.addEventListener("DOMContentLoaded", init);

function makeDivsAndListeners() {
    let columns = 11;
    let city = document.querySelector(".city");
    city.innerHTML = "";
    for (let i = 0;i < columns;i++){
        for (let j = 0;j < columns;j++){
            city.innerHTML += `<div class="buildingInAlhambra" data-row="${Math.round(i-columns/2)}"
            data-column="${Math.round(j-columns/2)}"></div>`;
        }
    }

    insertBuildings();
    let reserve = document.querySelector("#reserve");

    reserve.addEventListener("click",(e)=>{
        useBuildingInHand(null);
        setTimeout(() => location.reload(), 500);
    })
    let divs = document.querySelectorAll(".buildingInAlhambra");
    divs.forEach(div => {
        div.addEventListener("click", (e) => {
            getBuildingLocation(e);
            setTimeout(() => location.reload(), 500);
        })
    });
}

function getBuildingLocation(e) {
    if (e.target.hasChildNodes()) {
        let location = {
            "row" : e.target.closest('div').getAttribute("data-row"),
            "col" : e.target.closest('div').getAttribute("data-column")
        };
        placeInReserve(location)
    } else {
        let location = {
            "row" : e.target.getAttribute("data-row"),
            "col" : e.target.getAttribute("data-column")
        };
        useBuildingInHand(location);
    }
}

function placeInReserve(location) {
    let gameId = localStorage.getItem('gameId');
    let username = localStorage.getItem('username');
    let body = {
        "location": location
    };
    console.log(body);
    fetchFromServer(`${config.root}games/${gameId}/players/${username}/city`, 'PATCH', body).then()
}

function insertBuildings() {
    let username = localStorage.getItem('username');
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
                                div.innerHTML = `
                                    <p class="${building.type}" data-value="${building.cost}">${building.cost}</p>`;
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
    })
}

function displayTotalValue() {
    let totalValue = document.querySelector(".totalValue");
    let total = 0;
    let moneys = document.querySelectorAll(".yourMoney p");

    moneys.forEach(money => {
        total += parseInt(money.textContent);
    });

    totalValue.innerHTML = `Total value: ${total}`
}

function populateReserveAndListeners(response) {
    let username = localStorage.getItem('username');
    let myReserve;
    for (let player of response.players) {
        if (player.name === username) {
            myReserve = player.reserve;
        }
    }

    reserveUl.innerHTML = "";
    for (let building of myReserve) {
        reserveUl.innerHTML += `<li class="${building.type}" data-value="${building.cost}">${building.cost}</li>`;
        for (let [key, value] of Object.entries(building.walls)) {
            if (value) {
                reserveUl.lastElementChild.classList.add(key);
            }
        }
    }

    document.querySelectorAll('#reserve li').forEach(building => {
        building.addEventListener('click', (e) => selectReserve(e));
    })
}

function selectReserve(e) {
    if (e.target.classList.contains('selected')) {
        localStorage.removeItem('building');
        e.target.classList.remove('selected')
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
        playerList.innerHTML = playerList.innerHTML + `<a href="#" data-username="${player.name}" class="player">${player.name}</a>`
    }
    let players = document.querySelectorAll(".player");
    players.forEach(player => {
        player.addEventListener('click', (e) => showThisAlhambra(e, response))
    })
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

    reserveUl.innerHTML = "";
    for (let building of myReserve) {
        reserveUl.innerHTML += `<li class="${building.type}">${building.cost}</li>`;
        for (let [key, value] of Object.entries(building.walls)) {
            if (value) {
                reserveUl.lastElementChild.classList.add(key);
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

    totalValue.innerHTML = `Total value: ${total}`

}

function displayScores(response) {
    scoreboardBody.innerHTML = "";
    for (let player of response.players) {
        scoreboardBody.innerHTML += `
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
