"use strict";

let goBack = document.querySelector('.back');
let reserveUl = document.querySelector('#reserve');
let scoreboardBody = document.querySelector('#scoreboard tbody');

function init(){
    goBack.addEventListener('click', function () {
        window.location.href = "../src/generalBoard.html";
    });
    getAlhambraInfo();
    makeDivs();
}

document.addEventListener("DOMContentLoaded", init);

function makeDivs(){
    let columns = 11;
    let output = document.querySelector(".city");
    output.innerHTML = "";
    for (let i = 0;i < columns;i++){
        for (let j = 0;j < columns;j++){
            if (i === Math.floor(columns/2) && j === Math.floor(columns/2)){
                output.innerHTML += `<div class="fountain buildingInAlhambra" data-row="${Math.round(i-columns/2)}"
                data-column="${Math.round(j-columns/2)}">
                <img src="http://localhost:63342/webclient/src/images/Fountain.webp" alt="fountain"/></div>`;
            }
            else{
                output.innerHTML += `<div class="buildingInAlhambra" data-row="${Math.round(i-columns/2)}"
                data-column="${Math.round(j-columns/2)}"></div>`;
            }
            
        }
    }
    
    let divs = document.querySelectorAll(".buildingInAlhambra");
    let location;
    divs.forEach(div => {
        div.addEventListener("click", function (e) {
            location = {
                "row" : e.target.getAttribute("data-row"),
                "col" : e.target.getAttribute("data-column")
            };
            useBuildingInHand(location);
        })
    });
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
            displayScores(response);
        });
}
