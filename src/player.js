export class Player {
    constructor(xLocation, yLocation){
        this.x = xLocation;
        this.y = yLocation;
        this.velocityX = 0;
        this.velocityY = 0;
        this.height = 75;
        this.width = 75;
        this.image = new Image();
        this.image.src = "http://fast1.onesite.com/capcom-unity.com/user/snow_infernus/6244a04de1d004f70dc9fa04444319b5.png?v=57600";
        this.health = 100;
        this.justHit = false;
        this.score = 0;
        this.level = 1;
    }

}