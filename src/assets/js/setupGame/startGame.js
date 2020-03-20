"use strict";

function allPlayersReady(){
    let gameId = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${gameId}`, 'GET').then(
        function (response) {
            console.log(response);
            if(response.started === true){
                gameStart()
            }
        });
}

function gameStart() {

    goToPageInSecond('../src/general_board.html')

}

