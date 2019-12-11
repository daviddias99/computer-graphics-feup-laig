class Tile extends CGFobject {

    constructor(scene, sides, radius) {
        super(scene);

        this.radius = radius;
        this.piece = null;
        this.tile = new Poligon(scene, sides);
    }

    setPiece(piece) {
        this.piece = piece;
    }
    unsetPiece() {
        this.piece = null;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(this.radius, 1, this.radius);
        this.tile.display()
        this.scene.popMatrix();
    }
}