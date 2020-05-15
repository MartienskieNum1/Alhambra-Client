"use strict";

const BACKBUTTON = document.querySelector('.back');
const USERNAMEINPUT = document.querySelector('input[id="username"]');
const GAMEIDINPUT = document.querySelector('select');
const JOINBUTTON = document.querySelector('input[type="submit"]');

const init = () => {
    BACKBUTTON.addEventListener('click', function () {
        window.location.href = '../src/index.html';
    });

    fetchFromServer(`${config.root}games?details=false&prefix=group${config.groupnumber}`,'GET').then(function(response){
        console.log(response);
        GAMEIDINPUT.innerHTML = '';
        response.forEach(game => {
            GAMEIDINPUT.innerHTML += `<option>${game}</option>`;
        });
    });

    JOINBUTTON.addEventListener('click', function (e) {
        e.preventDefault();

        const gameId = GAMEIDINPUT.value;
        const USERNAME = USERNAMEINPUT.value;

        joinGame(USERNAME, gameId);
        goToPageInSecond('../src/lobby.html');
    });
};

document.addEventListener("DOMContentLoaded", init);
