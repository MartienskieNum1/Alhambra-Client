const HOMEBUTTON = document.querySelector('.home');
const NAMEBOARDBODY = document.querySelector('#score .font');
const SCOREBOARDBODY = document.querySelector('#score .scoreBord');

const init = () => {
    HOMEBUTTON.addEventListener('click', function () {
        window.location.href = '../src/index.html';
    });
    getScoreInfo();
};
document.addEventListener("DOMContentLoaded", init);

function getScoreInfo() {
    const GAMEID = localStorage.getItem('gameId');
    fetchFromServer(`${config.root}games/${GAMEID}`, 'GET').then(
        function (response) {
            displayScores(response);
        });
}

function displayScores(response) {
    NAMEBOARDBODY.innerHTML = "";
    SCOREBOARDBODY.innerHTML = "";
    for (const PLAYER of response.players) {
        NAMEBOARDBODY.innerHTML += `<p>${PLAYER.name}</p>`;
        SCOREBOARDBODY.innerHTML += `<p>${PLAYER.score}</p>`;
    }
}
