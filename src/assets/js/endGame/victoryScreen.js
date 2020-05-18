const BACKBUTTON = document.querySelector('.back');


const init = () => {
    BACKBUTTON.addEventListener('click', function () {
        window.location.href = '../src/score.html';
    });


};
document.addEventListener("DOMContentLoaded", init);
