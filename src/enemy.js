export class Enemy {
    constructor(xLocation, yLocation, imgLink){
        this.x = Math.random() * 1000 + 600;
        this.y = Math.random() * 400;
        this.height = 75;
        this.width = 75;
        this.velocityY = 0;
        this.velocityX = 0;
        this.image = new Image();
        this.image.src = imgLink;
    }


}