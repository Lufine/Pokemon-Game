const body = document.querySelector("body");
const game = document.querySelector(".game");

const count = document.querySelector("h1");
const reset = document.querySelector("#reset");

const ash = document.querySelector("#ash");
const pikachu = document.querySelector("#pikachu");
const charmander = document.querySelector("#charmander");
const zubat = document.querySelector("#zubat");

const scoreboard = document.querySelector(".scoreboard");

const endOptions = document.querySelector(".end-game-options");
const finalTime = document.querySelector("#final-time");
const btnViewRanking = document.querySelector("#btn-view-ranking");
const btnRestart = document.querySelector("#btn-restart");
const btnRestartLose = document.querySelector("#btn-restart-lose");
const btnMenu = document.querySelector("#btn-menu");
const btnMenuLose = document.querySelector("#btn-menu-lose");

const rankingDiv = document.querySelector(".ranking");
const btnSaveScore = document.querySelector("#btn-save-score");
const inputName = document.querySelector("#player-name");
const rankingList = document.querySelector("#ranking-list");

const closeModalLose = document.querySelector("#btn-close-lose");

let findPikachu = false;
let findCharmander = false;
let findZubat = false;

let gameEnded = false;

const audio = document.querySelector("audio");
audio.volume = 0.01;

const musicControl = document.querySelector(".music-control");

musicControl.addEventListener("click", (event) => {
    event.stopPropagation();
    event.target.src = event.target.src.includes("on.png")
        ? "./assets/icons/off.png"
        : "./assets/icons/on.png";

    event.target.src.includes("on.png") ? audio.play() : audio.pause();
});

reset.addEventListener("click", () => {
    window.location.reload();
});

function clearCharactersAndFinishGame() {
    ash.style.display = "none";
    charmander.style.display = "none";
    zubat.style.display = "none";
    pikachu.style.display = "none";
    // scoreboard.style.display = "none";

    reset.style.display = "block";
    count.textContent = "";
}

function clearCharactersAndFinishGameLose() {
    gameEnded = true;
    if (!findCharmander) charmander.style.display = "block";
    if (!findZubat) zubat.style.display = "block";
    if (!findPikachu) pikachu.style.display = "block";

    reset.style.display = "block";

}

closeModalLose.addEventListener("click", () => {
    const modal = document.getElementById("lose-modal");
    modal.style.display = "none";
});

let currentCount = parseInt(localStorage.getItem('tempoJogo')) || 40;

const interval = setInterval(() => {
    if (currentCount === 0) {
        // game.style.backgroundImage = "url(./assets/game-over.jpg)";
        clearCharactersAndFinishGameLose();
        clearInterval(interval);
        showLoseModal();
        return;
    }
    currentCount--;
    count.textContent = currentCount;
}, 1000);

function showLoseModal() {
    const modal = document.getElementById("lose-modal");
    const missingInfoEl = document.getElementById("missing-info");

    const missing = [];
    if (!findPikachu) {
        missing.push("Pikachu");
        pikachu.style.display = "block";
    }
    if (!findCharmander) {
        missing.push("Charmander");
        charmander.style.display = "block";
    }
    if (!findZubat) {
        missing.push("Zubat");
        zubat.style.display = "block";
    }

    if (missing.length === 0) {
        missingInfoEl.textContent = "Você encontrou todos os pokémons!";
    } else {
        missingInfoEl.innerHTML = `Você não encontrou:<br><strong>${missing.join(", ")}</strong>`;

    }

    modal.style.display = "block";
}


function finishGame() {
    if (findCharmander && findPikachu && findZubat) {
        clearCharactersAndFinishGame();

        const timeOut = setTimeout(() => {
            game.style.backgroundImage = "url(./assets/winner.jpg)";
            clearInterval(interval);
            clearTimeout(timeOut);
            audio.loop = true;

            const tempoInicial = parseInt(localStorage.getItem('tempoJogo')) || 40;
            const tempoLevado = tempoInicial - currentCount;

            finalTime.textContent = `Tempo restante: ${currentCount}s | Tempo levado: ${tempoLevado}s`;
            endOptions.style.display = "block";

            showFinalScore(tempoLevado);
        }, 800);
    }
}

function showFinalScore() {
    const finalScoreDiv = document.querySelector(".final-score");
    const scoreTime = document.querySelector("#score-time");

    scoreTime.textContent = `Tempo levado: ${tempoLevado}s`;
    finalScoreDiv.style.display = "block";

    const scores = JSON.parse(localStorage.getItem("ranking")) || [];
    scores.push(tempoLevado);
    scores.sort((a, b) => a - b);
    localStorage.setItem("ranking", JSON.stringify(scores.slice(0, 5))); 

    rankingList.innerHTML = "";
    scores.slice(0, 5).forEach((score, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}º - ${score}s`;
        rankingList.appendChild(li);
    });
}

btnRestartLose.addEventListener("click", () => {
    window.location.reload();
});

btnRestart.addEventListener("click", () => {
    window.location.reload();
});

btnMenu.addEventListener("click", () => {
    window.location.href = "inicio.html";
});

btnMenuLose.addEventListener("click", () => {
    window.location.href = "inicio.html";
});

btnViewRanking.addEventListener("click", () => {
    endOptions.style.display = "none";
    rankingDiv.style.display = "block";
});

let scoreSaved = false;

document.getElementById("btn-save-score").addEventListener("click", () => {
    if (scoreSaved) return;

    const name = document.getElementById("player-name").value.trim();

    const tempoRestante = parseInt(
        document.getElementById("final-time").textContent
            .replace("Tempo restante: ", " ")
            .replace("s", " ")
            .trim()
    );

    const tempoTotal = parseInt(localStorage.getItem("tempoJogo")) || 40;

    const tempoLevado = tempoTotal - tempoRestante;

    if (!name) {
        alert("Digite seu nome para salvar no ranking.");
        return;
    }

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    ranking.push({ name, time: tempoLevado });
    ranking.sort((a, b) => a.time - b.time);
    ranking = ranking.slice(0, 5);

    localStorage.setItem("ranking", JSON.stringify(ranking));
    scoreSaved = true;

    document.getElementById("player-name").disabled = true;
    document.getElementById("btn-save-score").disabled = true;
    renderRanking();
});


function renderRanking() {
    rankingList.innerHTML = "";

    const ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    for (let i = 0; i < 5; i++) {
        const item = ranking[i];
        const li = document.createElement("li");
        if (item) {
            li.textContent = `${i + 1}º - ${item.name}: ${item.time}s`;
        } else {
            li.textContent = `${i + 1}º - `;
        }
        rankingList.appendChild(li);
    }
}


document.getElementById("btn-view-ranking").addEventListener("click", () => {
    document.querySelector(".end-game-options").style.display = "none";
    document.querySelector(".ranking").style.display = "block";
});

document.getElementById("btn-back").addEventListener("click", () => {
    document.querySelector(".ranking").style.display = "none";
    document.querySelector(".end-game-options").style.display = "block";
});




function getRightPosition() {
    return parseInt(ash.style.right.split("px")) || 2;
}

function getTopPosition() {
    return parseInt(ash.style.top.split("px")) || 2;
}

function getRandomPositionWithDistance(existingPositions, minDistance = 100) {
    let valid = false;
    let right, top;

    while (!valid) {
        right = Math.floor(Math.random() * 770);
        top = Math.floor(Math.random() * 625);

        valid = existingPositions.every(pos => {
            const distX = Math.abs(parseInt(pos.right) - right);
            const distY = Math.abs(parseInt(pos.top) - top);
            return distX >= minDistance || distY >= minDistance;
        });
    }

    return { right: `${right}px`, top: `${top}px` };
}

const positions = [];

const pikachuPos = getRandomPositionWithDistance(positions);
positions.push(pikachuPos);
pikachu.style.right = pikachuPos.right;
pikachu.style.top = pikachuPos.top;

const charmanderPos = getRandomPositionWithDistance(positions);
positions.push(charmanderPos);
charmander.style.right = charmanderPos.right;
charmander.style.top = charmanderPos.top;

const zubatPos = getRandomPositionWithDistance(positions);
zubat.style.right = zubatPos.right;
zubat.style.top = zubatPos.top;


function isNear(pokemon) {
    const ashTop = getTopPosition();
    const ashRight = getRightPosition();
    const pokeTop = parseInt(pokemon.style.top);
    const pokeRight = parseInt(pokemon.style.right);

    const verticalClose = Math.abs(ashTop - pokeTop) <= 40;
    const horizontalClose = Math.abs(ashRight - pokeRight) <= 40;

    return verticalClose && horizontalClose;
}

function verifyLookPokemon(to){
    if (gameEnded) return;

    finishGame();

    if (isNear(charmander) && !findCharmander) {
        charmander.style.display = "block";
        findCharmander = true;
    }

    if (isNear(pikachu) && !findPikachu) {
        pikachu.style.display = "block";
        findPikachu = true;
    }

    if (isNear(zubat) && !findZubat) {
        zubat.style.display = "block";
        findZubat = true;
    }

    const baseRight = to === "ArrowLeft" ? getRightPosition() - 84 : getRightPosition() + 64;

    if(findCharmander){
        charmander.style.right = `${baseRight}px`;
        charmander.style.top = `${getTopPosition() - 18}px`;
    }

    if(findPikachu){
        pikachu.style.right = `${baseRight}px`;
        pikachu.style.top = `${getTopPosition() - 36}px`;
    }

    if(findZubat){
        zubat.style.right = `${baseRight}px`;
        zubat.style.top = `${getTopPosition() - 92}px`;
    }

    if (findPikachu) {
        document.querySelector("#check-pikachu").src = "./assets/icons/check.png";
    }
    if (findCharmander) {
        document.querySelector("#check-charmander").src = "./assets/icons/check.png";
    }
    if (findZubat) {
        document.querySelector("#check-zubat").src = "./assets/icons/check.png";
    }
    
}


body.addEventListener("keydown", (event) => {
    if (gameEnded) return;

    event.stopPropagation();

    switch (event.code) {
        case "ArrowLeft":
            if (getRightPosition() < 770) {
                ash.style.right = `${getRightPosition() + 8}px`;
                ash.src = "./assets/left.png";
                pikachu.src = "./assets/pokemons/pikachu-left.png";
                charmander.src = "./assets/pokemons/charmander-left.png";
                zubat.src = "./assets/pokemons/zubat-left.png";
            }
            break;
        case "ArrowRight":
            if (getRightPosition() > 2) {
                ash.style.right = `${getRightPosition() - 8}px`;
                ash.src = "./assets/right.png";
                pikachu.src = "./assets/pokemons/pikachu-right.png";
                charmander.src = "./assets/pokemons/charmander-right.png";
                zubat.src = "./assets/pokemons/zubat-right.png";
            }
            break;
        case "ArrowDown":
            if (getTopPosition() < 625) {
                ash.style.top = `${getTopPosition() + 8}px`;
                ash.src = "./assets/front.png";
                pikachu.src = "./assets/pokemons/pikachu-right.png";
                charmander.src = "./assets/pokemons/charmander-right.png";
                zubat.src = "./assets/pokemons/zubat-right.png";
            }
            break;
        case "ArrowUp":
            if (getTopPosition() > 2) {
                ash.style.top = `${getTopPosition() - 8}px`;
                ash.src = "./assets/back.png";
                pikachu.src = "./assets/pokemons/pikachu-right.png";
                charmander.src = "./assets/pokemons/charmander-right.png";
                zubat.src = "./assets/pokemons/zubat-right.png";
            }
            break;
        default:
            break;
    }

    verifyLookPokemon(event.code);
});
