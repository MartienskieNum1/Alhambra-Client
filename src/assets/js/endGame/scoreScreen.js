const HOMEBUTTON = document.querySelector('.home');

const init = () => {
    HOMEBUTTON.addEventListener('click', function () {
        window.location.href = '../src/index.html';
    });

};
document.addEventListener("DOMContentLoaded", init);
