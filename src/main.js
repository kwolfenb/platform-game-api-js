import { Player } from "./player";
import { Enemy } from "./enemy";
import { Explosion } from "./explosion";

let monstersArr = ["Demon", "Evil", "enemy", "skeleton", "ghost"];
let monster = monstersArr[Math.floor(Math.random() * 5)];

const url = `https://pixabay.com/api/?key=11303173-11f0442832adac1d8b6ec4e16&q=${monster}&colors=transparent`;

let imgLink;
let enemies = [];
const gravity = 0.5;
let onGround = false;

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

  for (let x = 0; x < 7; x++) {
    imgLink = body.hits[x].largeImageURL;
    let enemy = new Enemy(400, 400, imgLink);
    enemies.push(enemy);
  }

  function draw() {

    // BACKGROUND

    // ctx.fillStyle = "grey";
    // ctx.fillRect(0, 0, 1000, 500);

    // // FOREGROUND
    // ctx.fillStyle = "green";
    // ctx.fillRect(0, 475, 1000, 500);
    // ctx.fillStyle = "black";
    // ctx.fillRect(0, 485, 1000, 500);

    ctx.drawImage(background, 0, 0, 1000, 526);
    // CHARACTERS

    ctx.drawImage(player.image, player.x, player.y, player.height, player.width);

    for (let x = 0; x < enemies.length; x++) {
      ctx.drawImage(enemies[x].image, enemies[x].x, enemies[x].y, enemies[x].height, enemies[x].width);
    }

    // EXPLOSIONS

    ctx.drawImage(newExplosion.image, newExplosion.x, newExplosion.y, newExplosion.width, newExplosion.height);


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
      if (enemies[i].y > 390) {
        enemies[i].velocityY = 0;
        enemies[i].velocityX = -1;
      }
    }
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].x < -50) {
        enemies[i].x = 1050;
      }
    }

    // COLLISIONS

    for (let i = 0; i < enemies.length; i++) {
      if (player.x < enemies[i].x + enemies[i].width &&
        player.x + player.width > enemies[i].x &&
        player.y < enemies[i].y + enemies[i].height &&
        player.y + player.height > enemies[i].y && !onGround && player.velocityY > 0) {
        explosion(enemies[i]);
        enemies.splice(i, 1);
        player.velocityY = -5;
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


  setInterval(function () {
    draw(); update();
  }, 1000 / 60);


});






















