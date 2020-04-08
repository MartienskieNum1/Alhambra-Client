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
            displayScores(response);
        });
}
