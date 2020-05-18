const NEXTBUTTON = document.querySelector('.back');

const init = () => {
    NEXTBUTTON.addEventListener('click', function () {
        window.location.href = '../src/score.html';
    });


};
document.addEventListener("DOMContentLoaded", init);
