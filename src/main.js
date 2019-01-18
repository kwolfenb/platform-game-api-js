import { Player } from "./player";
import { Enemy } from "./enemy";
import { Explosion } from "./explosion";

let monstersArr = ["Demon", "Evil", "enemy", "skeleton", "ghost", "zombie", "dwarf", "grudge"];
let monster = monstersArr[Math.floor(Math.random() * 9)];

const url = `https://pixabay.com/api/?key=11303173-11f0442832adac1d8b6ec4e16&q=${monster}&colors=transparent`;

let imgLink;
let enemies = [];
const gravity = 0.5;
let onGround = false;
let timeout = false;
let qty = 10;

let promise = new Promise(function (resolve, reject) {
  let request = new XMLHttpRequest();
  request.onload = function () {
    if (this.status === 200) {
      resolve(request.response);
    } else {
      reject(Error(request.statusText));
    }
  }
  request.open("GET", url, true);
  request.send();
});

promise.then(function (response) {
  let body = JSON.parse(response);
  let canvasDiv = document.getElementById("screen");
  let ctx = canvasDiv.getContext("2d");

  // CHARACTER OBJECTS

  let player = new Player(25, 25);
  let newExplosion = new Explosion(-150, -150);
  let background = new Image();
  background.src = "https://chainimage.com/images/mario-wallpaper-full-hd-wallpaper-search-page-3-mario-wallpapers.png";

  function enemyArr(qty) {
    for (let x = 0; x < qty; x++) {
      imgLink = body.hits[x].largeImageURL;
      let enemy = new Enemy(imgLink);
      enemies.push(enemy);
    }
  }

  enemyArr(qty);

  function draw() {

    // BACKGROUND

    ctx.drawImage(background, 0, 0, 1000, 526);

    // CHARACTERS

    ctx.drawImage(player.image, player.x, player.y, player.height, player.width);

    for (let x = 0; x < enemies.length; x++) {
      ctx.drawImage(enemies[x].image, enemies[x].x, enemies[x].y, enemies[x].height, enemies[x].width);
    }

    // EXPLOSIONS

    ctx.drawImage(newExplosion.image, newExplosion.x, newExplosion.y, newExplosion.width, newExplosion.height);

    // HEALTH BAR

    ctx.fillStyle = "green";
    ctx.fillRect(20, 5, player.health * 4, 40);

    ctx.strokeStyle = "white";
    ctx.rect(20, 5, 400, 40);
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "30px Monospace";
    ctx.fillText(player.health + " HP", 30, 35);

    // SCORE BAR

    ctx.fillStyle = "gold";
    ctx.fillRect(550, 5, player.score * 10, 40);

    ctx.strokeStyle = "white";
    ctx.rect(550, 5, 400, 40);
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "30px Monospace";
    ctx.fillText(player.score + "$", 550, 35);


    ctx.fillStyle = "black";
    ctx.font = "20px Monospace";
    ctx.fillText("level: " + player.level, 850, 470);


  }

  function update() {


    // VELOCITY

    player.y = player.y + player.velocityY;
    player.x = player.x + player.velocityX;
    enemies.forEach(enemy => enemy.y = enemy.y + enemy.velocityY);
    enemies.forEach(enemy => enemy.x = enemy.x + enemy.velocityX);

    // GRAVITY

    if (!onGround) player.velocityY = player.velocityY + gravity;
    enemies.forEach(enemy => enemy.velocityY = enemy.velocityY + gravity);

    // GROUND

    if (player.y > 400) {
      onGround = true;
      player.y = 400;
    }

    // ENEMY MOVEMENT

    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].y > 350) {
        enemies[i].velocityY = 0;
      }
    }

    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].x < -50) {
        enemies[i].x = 1050;
      }
    }
    // ENEMY JUMPS
    for (let i = 0; i < enemies.length; i++) {
      if (Math.random() > 0.01 && Math.random() < 0.02)
        enemies[i].velocityY = -10;
    }


    for (let i = 0; i < enemies.length; i++) {
      for (let j = 1; j < enemies.length; j++) {
        if (isCollision(enemies[i], enemies[j]) && timeout === false) {
          timeout = true;
          enemies[i].x -= 10;
          setTimeout(function () {
            timeout = false;
          }, 100)
        }
      }
    }

    // ENEMY STOMPING

    for (let i = 0; i < enemies.length; i++) {
      if (isCollision(player, enemies[i]) && !onGround && player.velocityY > 0) {
        explosion(enemies[i]);
        enemies.splice(i, 1);
        player.velocityY = -5;
        player.score++;
      }
    }

    // PLAYER DAMAGE

    for (let i = 0; i < enemies.length; i++) {
      if (isCollision(player, enemies[i]) && (player.velocityY < 0 || onGround) && (!player.justHit)) {
        player.health = player.health - 10;
        player.justHit = true;
        setTimeout(function () {
          player.justHit = false;
        }, 500)
      }
    }

    // PLAYER DEATH

    if (player.health < 0) {
      player.velocityY = -1;
      ctx.fillStyle = "red";
      ctx.font = "60px butcherman";
      ctx.fillText("YOU DIED...", 400, 230);
    }

    // SPAWN ENEMIES
    if (enemies.length < 1) {
      player.level += 1;
      enemyArr(qty);
      for (let i = 0; i < enemies.length; i++) {
        enemies[i].velocityX *= 2;
      }
    }
  }

  // EVENT LISTENERS

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  function keyDown(event) {
    if (event.keyCode == 37) player.velocityX = -5;
    if (event.keyCode == 39) player.velocityX = 5;
    if ((event.keyCode == 38 || event.keyCode == 32) && onGround == true) {
      player.velocityY = -15;
      onGround = false;
    }
  }

  function keyUp(event) {
    if (event.keyCode == 37) player.velocityX = 0;
    if (event.keyCode == 39) player.velocityX = 0;
  }

  function explosion(enemy) {
    newExplosion.x = enemy.x;
    newExplosion.y = enemy.y;
    setTimeout(function () {
      newExplosion.x = -150;
      newExplosion.y = -150;
    }, 300);
  }

  function isCollision(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y) {
      return true;
    }
    return false;
  }

  setInterval(function () {
    draw();
    update();
  }, 1000 / 60);

});
