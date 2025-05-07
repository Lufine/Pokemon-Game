const jogar = document.getElementById('btn-jogar');
const containerBtn = document.querySelector('.container-btn');
const comoJogar = document.getElementById('btn-como-jogar');
const dificuldade = document.querySelector('.dificuldade');
const btnsVoltar = document.querySelectorAll('.back');
const info = document.querySelector('.como-jogar');

const facil = document.getElementById('facil');
const medio = document.getElementById('medio');
const dificil = document.getElementById('dificil');

jogar.addEventListener('click', function () {
    containerBtn.style.display = 'none';
    document.querySelector('.dificuldade').style.display = 'block';
});

dificuldade.addEventListener('click', function (event) {
    let tempo;

    if (event.target.id === 'facil') {
        tempo = 90;
    } else if (event.target.id === 'medio') {
        tempo = 60;
    } else if (event.target.id === 'dificil') {
        tempo = 40;
    }

    if (tempo) {
        localStorage.setItem('tempoJogo', tempo);
        window.location.href = 'index.html';
    }
});

comoJogar.addEventListener('click', function () {
    containerBtn.style.display = 'none';
    info.style.display = 'block';
});

btnsVoltar.forEach(btn => {
    btn.addEventListener('click', function () {
        containerBtn.style.display = 'block';
        dificuldade.style.display = 'none';
        info.style.display = 'none';
    });
});