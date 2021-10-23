'use strict';
const RUN = true;
const SIZE = 32;
const REFWIDTH = 160;
const REFHEIGHT = 160;

const numOrientations = 8;
const numMoves = 8;
const sourceWidth = SIZE;
const destinationWidth = SIZE;

let mainCanvas = document.createElement("canvas");
let mainContext = mainCanvas.getContext("2d");
let actualHeight = window.innerHeight;
let actualWidth = window.innerWidth;
mainCanvas.height = actualHeight;
mainCanvas.width = actualHeight;
document.body.appendChild(mainCanvas);

class GameObject {
    constructor() {
        this.x = 64;
        this.y = 128;
        this.dx = 1;
        this.dy = 1;
        this.speed = 2;

        this.currentStep = 0;
        this.animationRate = 1 / 3;

        this.sourceRun = new Image();
        this.sourceRun.src = "./resources/run.png";
        console.log(this.sourceRun);
    }

    jag() {
        this.dx = Math.round(Math.random() * 2 - 1) * 1;
        this.dy = Math.round(Math.random() * 2 - 1) * 1;
        if ((this.dx == 0) && (this.dy == 0)) {
            if (Math.round(Math.random()) > 0) {
                this.dx = 1; // TODO fix
            }
            else {
                this.dy = 1; // TODO fix
            }
        }
    }

    step() {
        this.currentStep = (this.currentStep + 1) % numMoves;
    }

    tick() {
        this.currentStep += this.animationRate % numMoves;
        let step = 1;
        if (this.dx == 0 || this.dy == 0) {
            step = 1.41421356237;
        }
        this.x += this.dx * step;
        this.y += this.dy * step;

        if (
            (this.y > REFHEIGHT - SIZE) ||
            (this.y < 0)
        ) {
            this.dy = - this.dy;
        }
        if (
            (this.x > REFWIDTH - SIZE) ||
            (this.x < 0)
        ) {
            this.dx = - this.dx;
        }
    }

    movement() {
        return Math.floor(this.currentStep) % numMoves;
    }

    orientation() {
        let orientation = 0;
        if (this.dx == 0) {
            if (this.dy < 0) {
                orientation = 0;
            }
            else {
                orientation = 4;
            }
        }
        else if (this.dy == 0) {
            if (this.dx < 0) {
                orientation = 6;
            }
            else {
                orientation = 2;
            }
        }
        else if (this.dx > 0) {
            if (this.dy > 0) {
                orientation = 3;
            }
            else if (this.dy < 0) {
                orientation = 1;
            }
        }
        else if (this.dx < 0) {
            if (this.dy > 0) {
                orientation = 5;
            }
            else if (this.dy < 0) {
                orientation = 7;
            }
        }
        return orientation % numOrientations;
    }
}

class Game {
    constructor(canvas, mainCharacter) {
        this.canvas = canvas;
        this.mainCharacter = mainCharacter;
        this.step = 0;
        this.lastJag = 0; // debug random
    }

    tick(currentTime) {
        this.mainCharacter.tick();
        if (currentTime - this.lastJag > 2000) {
            this.lastJag = currentTime;
            this.mainCharacter.jag();
            console.log("jag!");
        }
    }
}

window.onload = () => {
    console.log("Hello!");
    let mainCharacter = new GameObject();
    let game = new Game(mainCanvas, mainCharacter);

    let fps = 50,
        interval = 1000 / fps,
        lastTick = 0,
        delta = 0;

    let gameLoop = (currentTime) => {
        // TODO handle first tick/draw
        // console.debug(delta++);
        if (RUN || !currentTime || currentTime < 4000) {
            window.requestAnimationFrame(gameLoop);
        }
        // console.debug("---");
        // console.debug("currentTime = " + currentTime);
        // console.debug("lastTick = " + lastTick);
        if (currentTime - lastTick > interval) {
            game.tick(currentTime);
            // collisionDetection();
            lastTick += interval;
            delta = 0;
        }
        mainContext.clearRect(0, 0, REFWIDTH, REFHEIGHT); // clearBackground
        // Draw ...
        // Floor
        mainContext.rect(0, 0, REFWIDTH, REFHEIGHT);
        mainContext.fill();

        // Lulu
        // TODO binary orientation
        mainContext.drawImage(
            game.mainCharacter.sourceRun,
            game.mainCharacter.movement() * sourceWidth, game.mainCharacter.orientation() * sourceWidth,
            sourceWidth, sourceWidth,
            game.mainCharacter.x, game.mainCharacter.y,
            destinationWidth, destinationWidth
        );
    };

    gameLoop();
};