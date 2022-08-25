const canvasBackground = document.getElementById("background");
const ctxBackGround = canvasBackground.getContext("2d");
let image = document.getElementById("backgroundStar")
canvasBackground.width = innerWidth;
canvasBackground.height = innerHeight;
addEventListener("resize", () => {
    canvasBackground.width = innerWidth;
    canvasBackground.height = innerHeight;
    backgroundStars = [];
    createBackGroundStars();
})

class BackGroundStar {
    constructor(image, x, y, size) {
        this.image = image
        this.x = x;
        this.y = y;
        this.size = size
    }

    draw() {
        ctxBackGround.drawImage(image, this.x, this.y, this.size, this.size)
    }
}

const backgroundGradient = ctxBackGround.createLinearGradient(0, 0, 0, canvasBackground.height);
backgroundGradient.addColorStop(0, "#171e26");
backgroundGradient.addColorStop(1, "#3f586b");
let backgroundStars = [];

function createMountain(mountainAmount, height, color) {
    let startPosition = 0;
    let middlePosition = canvasBackground.width / mountainAmount / 2;
    let endPosition = canvasBackground.width / mountainAmount;

    for(let i = 0; i < mountainAmount; i++) {
        if(i >= 1) {
            startPosition = startPosition + (canvasBackground.width / mountainAmount);
            middlePosition = middlePosition + (canvasBackground.width / mountainAmount);
            endPosition = endPosition + (canvasBackground.width / mountainAmount);
        }

        ctxBackGround.beginPath();
        ctxBackGround.moveTo(startPosition - 325 , canvasBackground.height); // Move pen to bottom-left corner
        ctxBackGround.lineTo(middlePosition, canvasBackground.height - height) // Line to top corner
        ctxBackGround.lineTo(endPosition + 325, canvasBackground.height) // Line to bottom-right corner
        ctxBackGround.closePath(); // Line to bottom-left corner
        ctxBackGround.fillStyle = color;
        ctxBackGround.fill();
    }
}

function createBackGroundStars() {
    for(let i = 0; i < 100; i++) { 
        let size = Math.floor(Math.random() * (10 - 7 + 1)) + 7;
        let x = Math.random() * (canvasBackground.width - size);
        let y = Math.random() * (canvasBackground.height - size);
        backgroundStars.push(new BackGroundStar(image , x, y, size));
    }
}

createBackGroundStars()
export function drawBackGround() {
    // Fill background
    ctxBackGround.fillStyle = backgroundGradient;
    ctxBackGround.fillRect(0, 0, canvasBackground.width, canvasBackground.height);

    // Draw backgroundStars
    for(let i = 0; i < backgroundStars.length; i++) {
        backgroundStars[i].draw();
    }

    // Draw mountain
    createMountain(1, canvasBackground.height / 1.3, "#384551")
    createMountain(2, canvasBackground.height / 1.5, "#2B3843")
    createMountain(3, canvasBackground.height / 4, "#26333E")

    // Draw ground
    ctxBackGround.fillStyle = "#182028";
    ctxBackGround.fillRect(0, canvasBackground.height - 100, canvasBackground.width, 100)
}

drawBackGround()
