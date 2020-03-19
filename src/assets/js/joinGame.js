"use strict";

let backButton = document.querySelector('.back');
let usernameInput = document.querySelector('input[id="username"]');
let gameIDInput = document.querySelector('select');
let joinButton = document.querySelector('input[type="submit"]');

let init = () => {
    backButton.addEventListener('click', function () {
        window.history.back()
    });

    fetchFromServer(`${config.root}games?details=false&prefix=group${config.groupnumber}`,'GET').then(function(response){
        console.log(response);
        gameIDInput.innerHTML = '';
        response.forEach(game => {
            gameIDInput.innerHTML += `<option>${game}</option>`;
        });
    });


    joinButton.addEventListener('click', joinGame);
};

document.addEventListener("DOMContentLoaded", init);