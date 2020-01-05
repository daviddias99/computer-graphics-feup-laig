/**
 * Class that represents a tile of the gameboard of the game squex. The tile might be a octagon or a square. 
 * During the game, the Tile might hold a piece.
 */
class Tile {

    /**
     * 
     * @param {array} coords                xyz position coordinates of the tile
     * @param {array} pos                   game coordinates of the tile 
     * @param {CGFobject} primitive         primitive of the tile
     * @param {number} sides                number of sides of the tile 
     */
    constructor(coords, pos, primitive, sides) {
        
        this.coords = coords;
        this.pos = pos;
        this.primitive = primitive;
        this.sides = sides;

        // When created, a tile does not hold a piece
        this.piece = null;
    }

    /**
     * @method setPiece
     * 
     * Add a piece to the tile
     * @param {Piece} piece 
     */
    setPiece(piece) {
        this.piece = piece;
    }

    /**
     * @method unsetPiece
     * 
     * Remove the piece from the tile
     */
    unsetPiece() {
        this.piece = null;
    }

    /**
     * @method getBoardPosition
     * 
     * Get the game position of the tile.
     */
    getBoardPosition()
    {
        return this.pos;
    }

    /**
     * @method display
     * 
     * Display the tile of the board and it's piece. It registers itself for picking in the scene if the tile is a octagon.
     */
    display()
    {

        let scene = this.primitive.scene;

        scene.pushMatrix();
        scene.translate(...this.coords);

        // If the tile is octagon, register it for picking
        if (this.sides == 8)
        {            
            scene.rotate(Math.PI / 8, 0, 1, 0);
            scene.registerForPick(scene.pick_id, this);
        }

        if (this.piece == null){

             // Draw the tile
            this.primitive.display();
            scene.clearPickRegistration();
            scene.pick_id++;
        }
        else {

            // Draw the piece
            scene.clearPickRegistration();
            scene.pick_id++;
            this.piece.display();
        }
        
        scene.popMatrix();
    }
}