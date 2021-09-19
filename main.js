const SIZE = 32;

const numOrientations = 8;
const numMoves = 8;
const sourceWidth = SIZE;
const destinationWidth = 64;

class Engine {
    constructor(ctx) {
        this.ctx = ctx;
        this.step = 0;

        this.x = 64;
        this.y = 128;
        this.dx = 2;
        this.dy = 2;

        this.source = new Image();
        this.source.src = "./resources/run.png";
    }

    run() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Floor
        this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fill();

        // Lulu
        // TODO binary orientation
        let orientation = this.orientation();
        console.log(this.dx, orientation);
        let movement = Math.floor(this.step / 4) % numMoves;

        this.ctx.drawImage(
            this.source,
            movement * sourceWidth, orientation * sourceWidth, sourceWidth, sourceWidth,
            this.x, this.y, destinationWidth, destinationWidth
        );

        this.move();
        this.step += 1;
        // this.step = this.step % 1024;
        if (this.step == numMoves * 10) {
            this.step = 0;
            this.dx = Math.round(Math.random() * 2 - 1) * 2;
            this.dy = Math.round(Math.random() * 2 - 1) * 2;
            if ((this.dx == 0) && (this.dy == 0)) {
                if (Math.round(Math.random()) > 0) {
                    this.dx = 2; // TODO fix
                }
                else {
                    this.dy = 2; // TODO fix
                }
            }
            console.log(this.dx, this.dy);
        }
        requestAnimationFrame(() => this.run());
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

    move() {
        this.x += this.dx;
        this.y += this.dy;

        if (
            (this.y > this.ctx.canvas.height - SIZE * 2) ||
            (this.y < 0)
        ) {
            this.dy = - this.dy;
        }
        if (
            (this.x > this.ctx.canvas.width - SIZE * 2) ||
            (this.x < 0)
        ) {
            this.dx = - this.dx;
        }
    }
}

function main() {
    // -- Canvas
    let mainCanvas = document.createElement("canvas");
    let actualHeight = 512;
    mainCanvas.height = actualHeight;
    mainCanvas.width = actualHeight;
    document.body.appendChild(mainCanvas);

    // -- Control
    // document.addEventListener("keydown", keyDownHandler, false);
    // document.addEventListener("keyup", keyUpHandler, false);
    // document.addEventListener("touchstart", touchDownHandler, false);
    // document.addEventListener("touchend", touchUpDownHandler, false);
    context = mainCanvas.getContext("2d");
    myEngine = new Engine(context);
    myEngine.run();
}

main();

// TODO: fix diagonal speed (make speed constant)
// TODO: make idle state
