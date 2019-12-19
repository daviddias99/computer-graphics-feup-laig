class Piece {

    constructor(primitive, player) {
        this.primitive = primitive;
        this.player = player;
    }8

    display() {
        this.primitive.display(this.player)
    }
}