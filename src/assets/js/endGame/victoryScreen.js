const NEXTBUTTON = document.querySelector('.back');
const VICTORYBOARDBODY = document.querySelector('#victory h1');

const init = () => {
    NEXTBUTTON.addEventListener('click', function () {
        window.location.href = '../src/score.html';
    });
    getVictoryInfo();
};
document.addEventListener("DOMContentLoaded", init);

function getVictoryInfo() {
    const GAMEID = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${GAMEID}`, 'GET').then(
        function (response) {
            displayScores(response);
        });
}

function displayScores(response) {
    VICTORYBOARDBODY.innerHTML = "";
    let high = 0;
    let name = "";
    for (const PLAYER of response.players) {
        if(PLAYER.score > high){
            high = PLAYER.score;
            name = PLAYER.name;
        }
    }
    VICTORYBOARDBODY.innerHTML += `<h1>${name} is the winner!</h1>`;
}
