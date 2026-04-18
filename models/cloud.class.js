class Cloud extends MovableObject{

        y = 20;
        width = 500;
        height = 250;


         constructor(){
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = 0 + Math.random() * 200;
        this.animate();
    }


    animate(){
       setInterval( () => {
             this.moveLeft();
        }, 1000 / 30);
    }

}