import { drawBackGround } from "./background.js";
const canvas = document.getElementById("starShower");
const ctx = canvas.getContext("2d");
const btnIncreaseSpeed = document.getElementById("btnIncreaseSpeed")
canvas.width = innerWidth;
canvas.height = innerHeight;
addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
})

class Star {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.targetRadius = radius;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.gravity = 0.5;
        this.friction = 0.72;
        this.shrinkSpeed = 0.8;
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.targetRadius < this.radius) {
            this.radius = this.radius - this.shrinkSpeed < this.targetRadius ? this.targetRadius : this.radius - this.shrinkSpeed;
        }
    }
}

class MiniStar {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.friction = 0.88;
        this.gravity = 0.5;
        this.timeToLive = 1;
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.timeToLive;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.timeToLive -= 0.008;
    }
}

let stars = [];
let miniStars = [];
let timer = 1;
let spawnRate = 150;
let animationID;

function spawnStars() {
    let radius = Math.floor((Math.random() * (20 - 10 + 1))) + 10;
    let x = Math.floor(Math.random() * ((canvas.width - 25) - 25 + 1)) + 25;
    let y = -100;
    let color = "#E3EAEF";
    let velocity = {
        x: Math.random() > 0.5 ? (Math.random() * (10 - 2 + 1)) + 2 : (Math.random() * ((-10) - (-2) + 1)) + (-2),
        y: 2
    };
    stars.push(new Star(x, y, radius, color, velocity))
}

spawnStars()
function animate() {
    animationID = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackGround();


    // Draw stars
    for (let i = 0; i < stars.length; i++) {
        stars[i].update();

        // Collision between star and wall
        if (stars[i].x + stars[i].velocity.x - stars[i].radius < 0 || stars[i].x + stars[i].velocity.x + stars[i].radius > canvas.width) {
            stars[i].velocity.x = -stars[i].velocity.x * stars[i].friction;

            // Explosion
            for (let j = 0; j < stars[i].radius * 1.2; j++) {
                miniStars.push(new MiniStar(stars[i].x, stars[i].y, 2, stars[i].color, { x: (Math.random() * (5 - (-5) + 1) + (-5)), y: (Math.random() * (25 - (-25) + 1) + (-25)) }))
            }

            // Shrink and remove star
            if (stars[i].radius - 3 > 3) {
                stars[i].targetRadius -= 3;
            } else {
                stars.splice(i, 1);
                i--;
                continue;
            }
        }

        // Collsion between star and ground
        if (stars[i].y + stars[i].radius + stars[i].velocity.y > canvas.height - 100) {
            stars[i].velocity.y = -stars[i].velocity.y * stars[i].friction;

            // Explosion
            for (let j = 0; j < stars[i].radius * 1.2; j++) {
                miniStars.push(new MiniStar(stars[i].x, stars[i].y, 2, stars[i].color, { x: (Math.random() * (5 - (-5) + 1) + (-5)), y: (Math.random() * (25 - (-25) + 1) + (-25)) }))
            }

            // Shrink and remove star
            if (stars[i].radius - 3 > 3) {
                stars[i].targetRadius -= 3;
            } else {
                stars.splice(i, 1);
                i--;
                continue;
            }
        } else {
            stars[i].velocity.y += stars[i].gravity;
        }

        if(stars[i].radius < 0) {
            stars.splice(i, 1);
            i--;
        }
    }

    // Draw miniStars
    for (let i = 0; i < miniStars.length; i++) {
        miniStars[i].update();


        // Collsion between miniStar and ground 
        if (miniStars[i].y + miniStars[i].radius + miniStars[i].velocity.y > canvas.height - 100) {
            miniStars[i].velocity.y = -miniStars[i].velocity.y * miniStars[i].friction
        } else {
            miniStars[i].velocity.y += miniStars[i].gravity;
        }

        // Remove miniStar
        if (miniStars[i].timeToLive <= 0) {
            miniStars.splice(i, 1);
            i--;
        }
    }

    timer++;
    if (timer % spawnRate == 0 && spawnRate > 1) {
        spawnStars();
        timer = 1;
    }
}
animate();

btnIncreaseSpeed.addEventListener("click", () => {
    spawnRate = Math.floor(spawnRate / 1.14);
    timer = 1;
})