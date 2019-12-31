class MovingPiece {

    constructor(scene,primitive, player, pos) {
        this.scene = scene;
        this.primitive = primitive;
        this.player = player;
        this.animation = null;
        this.pos = pos;
    }

    display() {
        
        
        if(this.transformation != null){
            this.animation.apply();
        }
        
        this.scene.translate(...this.pos);
        this.scene.rotate(Math.PI / 8, 0, 1, 0);
        this.primitive.display(this.player);


    }
}