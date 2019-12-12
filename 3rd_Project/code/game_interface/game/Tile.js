class Tile extends CGFobject {

    constructor(scene, sides, radius) {
        super(scene);

        this.sides = sides;
        this.radius = radius;
        this.piece = null;
        this.tile = new Poligon(this.scene, this.sides);
    }

    setPiece(material) {
        this.piece = new Piece(this.scene, this.sides, material)
    }
    unsetPiece() {
        this.piece = null;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(this.radius, 1, this.radius);

        if (this.piece != null)
            this.piece.display();
        else if (this.sides == 8) {
            this.scene.registerForPick(this.scene.pick_id, this.tile);
            this.tile.display();
            this.scene.pick_id++;
            this.scene.clearPickRegistration();
        }
        else
            this.tile.display();

        this.scene.popMatrix();
    }
}