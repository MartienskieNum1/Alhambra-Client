"use strict";

let playerMoney = document.querySelector('.yourMoney');

function givePlayerMoney(response) {
    let username = localStorage.getItem('username');
    playerMoney.innerHTML = "";

    for (let i = 0; i < response.players.length; i ++) {
        if(response.players[i].name === username){
            for (let j = 0; j < response.players[i].coins.length; j ++){
                playerMoney.innerHTML += `<p class="${response.players[i].coins[j].currency}">${response.players[i].coins[j].amount}</p>`;
            }
        }
    }
}

function placeInAlhambra() {
    window.location.href = '../src/myAlhambraIndex.html';
}

function useBuildingInHand(location) {
    let gameId = localStorage.getItem('gameId');
    let username = localStorage.getItem('username');
    if (localStorage.getItem('building')) {
        let body = {
            "building": JSON.parse(localStorage.getItem('building')),
            "location": location
        };
        fetchFromServer(`${config.root}games/${gameId}/players/${username}/city`, 'PATCH', body).then()
    } else {
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
                    "location": location
                };
                fetchFromServer(`${config.root}games/${gameId}/players/${username}/city`, 'POST', body).then(
                    function () {
                        let pathName = window.location.pathname;
                        if (pathName === '/webclient/src/generalBoard.html') {
                            hidePopupToPlace();
                            getStartGameInfo();
                        }
                    }
                )
            });
    }
}

