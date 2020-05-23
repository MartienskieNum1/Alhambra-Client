"use strict";

const PLAYERMONEY = document.querySelector('.yourMoney');

function givePlayerMoney(response) {
    const USERNAME = localStorage.getItem('username');
    PLAYERMONEY.innerHTML = "";

    for (let i = 0; i < response.players.length; i ++) {
        if(response.players[i].name === USERNAME){
            for (let j = 0; j < response.players[i].coins.length; j ++){
                PLAYERMONEY.innerHTML += `<p class="${response.players[i].coins[j].currency}">${response.players[i].coins[j].amount}</p>`;
            }
        }
    }
}

function placeInAlhambra() {
    window.location.href = '../src/myAlhambraIndex.html';
}

function useBuildingInHand(location) {
    const GAMEID = localStorage.getItem('gameId');
    const USERNAME = localStorage.getItem('username');
    if (localStorage.getItem('building')) {
        const BODY = {
            "building": JSON.parse(localStorage.getItem('building')),
            "location": location
        };
        fetchFromServer(`${config.root}games/${GAMEID}/players/${USERNAME}/city`, 'PATCH', BODY).then(
            () => {
                localStorage.removeItem('building');
                getAlhambraInfo();
                makeDivsAndListeners();
            }
        );
    } else {
        fetchFromServer(`${config.root}games/${GAMEID}`, 'GET').then(
            function (response) {
                let building;
                for (const PLAYER of response.players) {
                    if (PLAYER.name === USERNAME) {
                        building = PLAYER["buildings-in-hand"][0];
                    }
                }
                const BODY = {
                    "building": building,
                    "location": location
                };
                fetchFromServer(`${config.root}games/${GAMEID}/players/${USERNAME}/city`, 'POST', BODY).then(
                    function (response) {
                        const PATHNAME = window.location.pathname;
                        if (response.failed) {
                            showAlertPopup(response);
                        }
                        if (PATHNAME === '/webclient/src/generalBoard.html') {
                            hidePopupToPlace();
                            getStartGameInfo();
                        } else {
                            getAlhambraInfo();
                            makeDivsAndListeners();
                        }
                    }
                );
            }
        );
    }
}

