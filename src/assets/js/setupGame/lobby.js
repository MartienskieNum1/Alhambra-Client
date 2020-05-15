"use strict";

const READYBUTTON = document.querySelector('.ready');
const LEAVEBUTTON = document.querySelector('.leave');
const POPUPLEFTGAME = document.querySelector('.popupLeftGame');

let init = () => {
    LEAVEBUTTON.addEventListener('click', LEAVEGAME);

    if (localStorage.getItem('ready')) {
        READYBUTTON.innerHTML = 'Not ready';
    } else {
        READYBUTTON.innerHTML = 'Ready';
    }

    checkAllPlayersReady();
    setInterval(function(){checkAllPlayersReady();},2000);
    SETUPLOBBY();
    setInterval(function(){SETUPLOBBY();},2000);

    READYBUTTON.addEventListener('click', READYUP);
};
document.addEventListener("DOMContentLoaded", init);

const LEAVEGAME = () => {
    const GAMEID = localStorage.getItem('gameId');
    const USERNAME = localStorage.getItem('username');
    fetchFromServer(`${config.root}games/${GAMEID}/players/${USERNAME}`, 'DELETE').then(
        function () {
            localStorage.clear();
            showPopupLeftGame();

        }
     );
};

function showPopupLeftGame() {
    console.log("test");
    POPUPLEFTGAME.classList.remove('hidden');
}


function checkAllPlayersReady(){
    const AMOUNTREADY = document.querySelector('.amountReady');
    const GAMEID = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${GAMEID}`, 'GET').then(
        function (response) {
            console.log(response);
            AMOUNTREADY.innerHTML = `${response.readyCount}`;
            if(response.started === true){
                localStorage.removeItem('ready');
                goToPageInSecond('../src/generalBoard.html');
            }
        });
}

const SETUPLOBBY = () => {
    const GAMEID = localStorage.getItem('gameId');
    const PLAYERLIST = document.querySelector('.players');
    const GAMEIDELEMENT = document.querySelector('.gameID');

    GAMEIDELEMENT.innerHTML = GAMEID;

    fetchFromServer(`${config.root}games/${GAMEID}`, 'GET').then(
        function (response) {
            PLAYERLIST.innerHTML = "";
            for (const PLAYER of response.players) {
                PLAYERLIST.innerHTML += `<li>${PLAYER}</li>`;
            }
        });
};

const READYUP = () => {
    const GAMEID = localStorage.getItem('gameId');
    const USERNAME = localStorage.getItem('username');

    if (!localStorage.getItem('ready')) {
        fetchFromServer(`${config.root}games/${GAMEID}/players/${USERNAME}/ready`, 'PUT').then(
            function (response) {
                localStorage.setItem('ready', `${response}`);
                READYBUTTON.innerHTML = 'Not ready';
            }
        );
    }

    if (localStorage.getItem('ready')) {
        fetchFromServer(`${config.root}games/${GAMEID}/players/${USERNAME}/ready`, 'DELETE').then(
            function () {
                localStorage.removeItem('ready');
                READYBUTTON.innerHTML = 'Ready';
            }
        );
    }
};
