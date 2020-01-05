
/**
 * This class represents the boards of the squex game. It has functions filling the board, display the boards, tiles and the pieces.
 */
class Board {

    /**
     * @constructor                     Board constructor
     * @param {XMLscene} scene          Reference to the scene in which the board will be dispayed
     * @param {Array} primitives        Array of CGFobjects containing the primitives : [oct_tile, oct_piece, sqr_tile, sqr_piece]
     * @param {Number} rows             Number of rows of octagonal tiles/pieces
     * @param {Number} cols             Number of columns of octagonal tiles/pieces
     * @param {Array}  boardMaterials   Array of materials (CGFappearance), the first one is the material for the main board and the second is the material for the aux board 
     */
    constructor(scene, primitives, rows, cols, boardMaterials)
    {
        this.scene = scene;
        this.primitives = primitives;
        this.rows = rows;
        this.cols = cols;
        this.boardMaterials = boardMaterials;

        this.initBoard();
        
    }

     /**
     * @method changeMaterials
     * 
     * Change the materials of the boards (main board and auxiliary board)
     * @param {Array} materials 
     */
    changeMaterials(boardMaterials) {
        this.boardMaterials = boardMaterials;
        this.boardPrimitive.changeMaterials(boardMaterials);
        this.auxBoards.changeMaterials(boardMaterials[1]);
    }

    /**
     * @method initBoard
     * 
     * Initialize the board. This creates the auxiliary boards, the board tiles and the main board primitive.
     */
    initBoard()
    {
        this.boardPrimitive = new BoardPrimitive(this.scene, this.cols, this.rows, this.primitives, this.boardMaterials);
        this.auxBoards = new AuxiliaryBoards(this.scene, this.cols, this.rows, this.primitives, this.boardMaterials[1], this.boardPrimitive);
        this.octagons = [];
        this.squares = [];

        // Create the octagon and square tiles

        for (let i = 0; i <= this.rows; i++)
        {
            let oct_line = [];
            let sqr_line = [];

            for (let j = 0; j <= this.cols; j++)
            {
                if (j < this.cols && i < this.rows)
                {
                    oct_line.push(new Tile(this.boardPrimitive.getPosition(j,i,0,'octagon'), [j, i], this.primitives[0], 8));
                }
                sqr_line.push(new Tile(this.boardPrimitive.getPosition(j,i,0,'square'), [j, i], this.primitives[2], 4));
            }
            if (i < this.rows)
                this.octagons[i] = oct_line;

            this.squares[i] = sqr_line;
        }

    }


    /**
     * @method fillBoards
     * 
     * Fills the tiles of the board with pieces of the correct color given a board configuration through number arrays.
     * @param {array} octagons  array with the size of the octagon board whose cells have values 0,1,2 corresponding of the cell is empty or if it has a piece of a given player
     * @param {array} squares   array with the size of the square board whose cells have values 0,1,2 corresponding of the cell is empty or if it has a piece of a given player
     */
    fillBoards(octagons, squares) {


        // Fill the octagon pieces
        for (let i = 0; i < octagons.length; i++) {

            for (let j = 0; j < octagons[i].length; j++) {

                let octagon = octagons[i][j];

                if (octagon != 0) {

                    this.octagons[i][j].setPiece(new Piece(this.primitives[1], octagon));
                }
                else {
                    this.octagons[i][j].unsetPiece();
                }
            }
        }

        // Fill the square pieces
        for (let i = 0; i < squares.length; i++) {

            for (let j = 0; j < squares[i].length; j++) {

                let square = squares[i][j];

                if (square != 0) {

                    this.squares[i][j].setPiece(new Piece(this.primitives[3], square));
                }
                else {
                    this.squares[i][j].unsetPiece();
                }
            }
        }

    }

    /**
     * @method startAnimation
     * 
     * Signal the auxiliary boards to start the piece transfer animation
     * @param {number}   player  id of the player that did the move
     * @param {Move}     move    move done by player
     */
    startAnimation(player,move){

        this.auxBoards.startAnimation(player,move);
    }

    /**
     * @method display
     * 
     * Display the main board casing, the tiles and the auxiliary boards.
     */
    display()
    {
        this.boardPrimitive.display();
        this.auxBoards.display();

        for (let i = 0; i <= this.rows; i++)
        {
            for (let j = 0; j <= this.cols; j++)
            {
                if (j < this.cols && i < this.rows)
                {
                    this.octagons[i][j].display();
                }
                this.squares[i][j].display();
            }
        }

        this.scene.popMatrix();
    }
}