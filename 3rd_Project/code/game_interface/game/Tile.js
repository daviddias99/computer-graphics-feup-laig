class Tile {

    constructor(coords, pos, primitive, sides) {
        
        this.coords = coords

        this.pos = pos;

        this.primitive = primitive;
        this.sides = sides;

        this.piece = null;

    }

    setPiece(piece) {
        this.piece = piece;
    }

    unsetPiece() {
        this.piece = null;
    }

    getBoardPosition()
    {
        return this.pos;
    }

    display()
    {

        let scene = this.primitive.scene;

        scene.pushMatrix();
        scene.translate(...this.coords);

        if (this.sides == 8)
        {            
            scene.rotate(Math.PI / 8, 0, 1, 0);
            scene.registerForPick(scene.pick_id, this);
        }

        if (this.piece == null){
            this.primitive.display();
            scene.clearPickRegistration();
            scene.pick_id++;
        }
        else {
            scene.clearPickRegistration();
            scene.pick_id++;
            this.piece.display();
        }
        


        scene.popMatrix();
    }
}