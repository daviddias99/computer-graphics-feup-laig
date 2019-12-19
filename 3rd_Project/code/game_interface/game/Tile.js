class Tile {

    constructor(scene, coords, pos, primitive, sides) {
        this.scene = scene;
        
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
        this.scene.pushMatrix();
        this.scene.translate(...this.coords);

        if (this.sides == 8)
        {            
            this.scene.rotate(Math.PI / 8, 0, 1, 0);
            this.scene.registerForPick(this.scene.pick_id, this);
        }

        if (this.piece == null)
            this.primitive.display();
        else 
            this.piece.display();
        
        if (this.sides == 8)
        {
            this.scene.clearPickRegistration();
            this.scene.pick_id++;
        }

        this.scene.popMatrix();
    }
}