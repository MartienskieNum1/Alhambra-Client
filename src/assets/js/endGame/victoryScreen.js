const NEXTBUTTON = document.querySelector('.back');
const SCOREBOARDBODY = document.querySelector('#victory h1');

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
    SCOREBOARDBODY.innerHTML = "";
    for (const PLAYER of response.players) {
        //if()
        SCOREBOARDBODY.innerHTML += `<h1>${PLAYER.name} is the winner!</h1>`;
    }
}
