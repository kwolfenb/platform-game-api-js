export class Enemy {
    constructor(imgLink){
        this.x = Math.random() * 2000 + 600;
        this.y = Math.random() * 400;
        this.height = Math.random() * 50 + 75;
        this.width = Math.random() * 50 + 75;
        this.velocityY = 0;
        this.velocityX = -(Math.random() * 2) - .5;
        this.image = new Image();
        this.image.src = imgLink;
    }

}