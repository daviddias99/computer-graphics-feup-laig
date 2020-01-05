/**
 * Class that represents a piece of the game squex (octagon or square). 
 */
class Piece {

    /**
     * @constructor 
     * @param {CGFobject} primitive     primitive representation of the piece
     * @param {number} player           player id
     */
    constructor(primitive, player) {
        this.primitive = primitive;
        this.player = player;
    }

    /**
     * @method display
     * 
     * Display the piece primitive
     */
    display() {
        this.primitive.display(this.player)
    }
}