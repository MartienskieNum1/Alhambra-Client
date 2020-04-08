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

    let location1;
    let divs = document.querySelectorAll(".buildingInAlhambra");
    divs.forEach(div => {
        div.addEventListener("click", function (e) {
            location1 = {
                "row" : e.target.getAttribute("data-row"),
                "col" : e.target.getAttribute("data-column")
            };
            useBuildingInHand(location1);
            setTimeout(() => location.reload(), 500);
        })
    });
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
            populateReserve(response);
            loadAllPlayers(response);
            displayScores(response);
        });
}
