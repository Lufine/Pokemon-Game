const body = document.querySelector("body");
const game = document.querySelector(".game");

const count = document.querySelector("h1");
const reset = document.querySelector("#reset");

const ash = document.querySelector("#ash");
const pikachu = document.querySelector("#pikachu");
const charmander = document.querySelector("#charmander");
const zubat = document.querySelector("#zubat");

let findPikachu = false;
let findCharmander = false;
let findZubat = false;

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

    reset.style.display = "block";
    count.textContent = "";
}

let currentCount = 40;
const interval = setInterval(() => {
    if (currentCount === 0) {
        game.style.backgroundImage = "url(./assets/game-over.jpg)";
        clearCharactersAndFinishGame();
        clearInterval(interval);
        return;
    }
    currentCount--;
    count.textContent = currentCount;
}, 1000);

function finishGame() {
    if (findCharmander && findPikachu && findZubat) {
        clearCharactersAndFinishGame();

        const timeOut = setTimeout(() => {
            game.style.backgroundImage = "url(./assets/winner.jpg)";
            clearInterval(interval);
            clearTimeout(timeOut);
            audio.pause();
        }, 800);
    }
}

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

    const baseRight = to === "ArrowLeft" ? getRightPosition() - 64 : getRightPosition() + 64;

    if(findCharmander){
        charmander.style.right = `${baseRight}px`;
        charmander.style.top = `${getTopPosition() - 8}px`;
    }

    if(findPikachu){
        pikachu.style.right = `${baseRight}px`;
        pikachu.style.top = `${getTopPosition() - 46}px`;
    }

    if(findZubat){
        zubat.style.right = `${baseRight}px`;
        zubat.style.top = `${getTopPosition() - 72}px`;
    }
}


body.addEventListener("keydown", (event) => {
    event.stopPropagation();

    switch (event.code) {
        case "ArrowLeft":
            if (getRightPosition() < 770) {
                ash.style.right = `${getRightPosition() + 8}px`;
                ash.src = "./assets/left.png";
            }
            break;
        case "ArrowRight":
            if (getRightPosition() > 2) {
                ash.style.right = `${getRightPosition() - 8}px`;
                ash.src = "./assets/right.png";
            }
            break;
        case "ArrowDown":
            if (getTopPosition() < 625) {
                ash.style.top = `${getTopPosition() + 8}px`;
                ash.src = "./assets/front.png";
            }
            break;
        case "ArrowUp":
            if (getTopPosition() > 2) {
                ash.style.top = `${getTopPosition() - 8}px`;
                ash.src = "./assets/back.png";
            }
            break;
        default:
            break;
    }

    verifyLookPokemon(event.code);
});
