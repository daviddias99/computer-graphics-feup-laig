class Piece {

    constructor(primitive, player) {
        this.primitive = primitive;
        this.player = player;
    }

    display() {
        this.primitive.display(this.player)
    }
}