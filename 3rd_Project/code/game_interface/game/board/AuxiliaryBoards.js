/**
 * The class AuxiliaryBoards holds information about both auxiliary boards of the squex game. The auxiliary board holds the pieces that are yet to be played.
 * This class, and the objects that it holds, handle the drawing of these boards and the pieces that they contain. They also handle the animation of pieces
 * to the board as they are played. 
 * The animation logic that is used is explained in the classe auxiliary board.
 */
class AuxiliaryBoards {

    /**
     * @constructor
     * 
     * Create the squex game auxiliary boards.
     * 
     * @param {CGFscene} scene                      scene
     * @param {number} cols                         columns of the main board
     * @param {number} rows                         rows of the main board
     * @param {array} primitives                    primitives used the aux-boards pieces
     * @param {array} material                      material of the auxiliary boards
     * @param {BoardPrimitive} boardPrimitive       primitive of the auxiliary board casing
     */
    constructor(scene, cols, rows, primitives, material, boardPrimitive) {

        this.scene = scene;
        this.cols = cols;
        this.rows = rows;
        this.primitives = primitives;
        this.material = material;
        this.boardPrimitive = boardPrimitive;

        this.init();
    }

    /**
    * @method changeMaterials
    * 
    * Change the material of the auxiliary boards casings
    * @param {CGFappearance} material 
    */
    changeMaterials(material) {
        this.material = material;
        this.boards[0].changeMaterials(material);
        this.boards[1].changeMaterials(material);
    }

    /**
     * @method init
     * 
     * Create the auxiliary board objects
     */
    init() {

        // On auxiliary board for each player
        this.boards = [];
        this.boards[0] = new AuxiliaryBoard(this.scene, this.cols, this.rows, 1, this.primitives[1], -1, this.material, this.boardPrimitive);
        this.boards[1] = new AuxiliaryBoard(this.scene, this.cols, this.rows, 2, this.primitives[1], 1, this.material, this.boardPrimitive);
    }

    /**
     * @method display
     * 
     * Display both aux boards
     */
    display() {

        this.boards[0].display();
        this.boards[1].display();
    }

    /**
     * @method startAnimation
     * 
     * Start the animation of the correct piece from player's auxiliary board to the main board
     * @param {number} player   id of the player that executes move
     * @param {Move} move       move executed by player or undo if the last move should be undone
     */
    startAnimation(player, move) {

        this.boards[player - 1].startAnimation(move);
    }

    /**
     * @method update
     * 
     * Update the auxiliary boards
     * @param {number} time 
     */
    update(time) {

        this.boards[0].update(time);
        this.boards[1].update(time);
    }

    /**
     * @method animationOnGoing
     * 
     * Check if any auxiliary board is currently animating a piece. 
     * 
     * @return true if any aux board is animating a piece
     */
    animationOnGoing() {

        return this.boards[0].pieceOnAnimation || this.boards[1].pieceOnAnimation;
    }

}

/**
 * The AuxiliaryBoard class represents one of the auxiliary boards of the game squex. A auxiliary boad as a set of slots (AuxiliaryBoardSlot) that hold
 * pieces that have yet to be played in the game. Each slot holds pieces(octagons) for a given column of the gameboard. This pieces are organized in piles
 * and when a player makes a move, an piece is animated from it's slot to the correct position on the board. When the animation ends the piece is removed the
 * piece on animation position (only one piece can be animated at one given time) and is inserted into a piece feed stack, and no longer is displayed to the user.
 * At this point the orchestrator starts displaying the new piece in the board so the transition is seemless. When an undo happens, the first piece in the piece
 * feed is animated back into it's original slot.
 */
class AuxiliaryBoard {

    /**
     * 
     * @param {CGFscene} scene                  scene
     * @param {number} cols                     number of columns of the main board
     * @param {number} rows                     number of rows of the main board
     * @param {number} player                   player corresponding to the board
     * @param {PiecePrimitive} piecePrimitive   primitive used for the octagon pieces
     * @param {number} type                     1 if player 1, -1 if player 2
     * @param {CGFappearance} material          material used for the auxiliar board casing
     * @param {BoardPrimitive} boardPrimitive   main board primitive (used for fetching position arguments)
     */
    constructor(scene, cols, rows, player, piecePrimitive, type, material, boardPrimitive) {

        this.scene = scene;
        this.pieceFeed = [];

        // pieceOnanimation stores a reference to the piece that is being animated at the moment
        this.pieceOnAnimation = null;

        // piecedirection signals if pieceOnanimation is coming to (board) or from (index of it's slot) the main board
        this.pieceDirection = null;
        this.auxBoardPrimitive = new AuxiliaryBoardPrimitive(scene, rows, boardPrimitive, type, material);
        this.boardPrimitive = boardPrimitive;
        this.type = type;
        this.material = material;

        // Create the slots for the piles of pieces. One for each column
        this.slots = [];

        for (let i = 0; i < cols; i++) {
            this.slots.push(new AuxiliaryBoardSlot(scene, rows, player, i, piecePrimitive, type, boardPrimitive));
        }

    }

    /**
    * @method changeMaterials
    * 
    * Change the material of the auxiliary board casing
    * @param {CGFappearance} material 
    */
    changeMaterials(material) {
        this.material = material;
        this.auxBoardPrimitive.changeMaterials(material);
    }

    /**
     * @method startAnimation
     * 
     * Start the animation of the correct piece from auxiliary board to the main board
     * @param {Move} move       move executed by player or undo if the last move should be undone
     */
    startAnimation(move) {

        if (move == 'undo')
            this.startUndoAnimation();
        else
            this.startRegularAnimation(move);
    }

    /**
     * @method startUndoAnimation
     * 
     * Start the reverse animation of the first piece in the pieceFeed stack back into the correct aux board slot-
     */
    startUndoAnimation() {

        // Remove the last piece that was added to the storage of pieces that left the auxiliary board
        let status = this.pieceFeed.pop();
        this.pieceOnAnimation = status[1];
        this.pieceDirection = status[0];

        // Start the animation back to the auxiliary board
        this.pieceOnAnimation.animation.startReverseAnimation();
    }

    /**
     * @method startRegularAnimation
     * 
     * Generate the keyframes and start the animation of the correct moving piece from the aux board to the main board
     * @param {Move} move 
     */
    startRegularAnimation(move) {

        // Remove the piece that is on top of the stack of it's color that is in the same column
        this.pieceOnAnimation = this.slots[move.x].pieces.pop();

        // Animation calibration
        let finalPos = this.boardPrimitive.getPosition(move.x, move.y, 0, 'octagon');
        let initialPos = this.pieceOnAnimation.pos;
        let height = this.boardPrimitive.cols * 0.1;
        let animationTime = 0.5;
        let effectiveKeyframeCount = 20;

        // Animation creation
        let keyframes = QuadraticKfGenerator.generateKeyFrames(initialPos, finalPos, height, animationTime, effectiveKeyframeCount);
        let kfAnimation = new KeyFrameAnimation(this.scene, 0, keyframes);
        kfAnimation.inUse = true;

        // Set "global values"
        this.pieceOnAnimation.animation = kfAnimation;
        this.pieceDirection = 'board';                              // signal that the animation is from the aux-board to the regular board

        // add this piece to the storage of pieces that left the aux-board the x position of the piece is added to identify the slot from which it came from
        this.pieceFeed.push([move.x, this.pieceOnAnimation]);
    }

    /**
     * @method display
     * 
     * Display the piece that is animating, the auxiliary board casing and the aux board pieces
     */
    display() {

        this.auxBoardPrimitive.display();

        for (let i = 0; i < this.slots.length; i++) {

            this.slots[i].display();
        }

        if (this.pieceOnAnimation) {

            this.pieceOnAnimation.display();
        }

    }

    /**
     * @method update
     * 
     * Update the piece that is animating (if there is one)
     * @param {number} time 
     */
    update(time) {

        // Check if any piece is animating
        if (!this.pieceOnAnimation)
            return;

        // Update it's animation
        this.pieceOnAnimation.animation.update(time);

        // If the animation is over
        if (!this.pieceOnAnimation.animation.inUse) {

            // If the piece was headed to the board, remove it from the "on animation" slot
            if (this.pieceDirection == 'board') {

                this.pieceOnAnimation = null;
            }
            // If the piece was headed to the aux-board, added it to the correct slot and remove it from the "on animation" slot
            else {

                this.slots[this.pieceDirection].pieces.push(this.pieceOnAnimation);
                this.pieceOnAnimation = null;
            }
        }
    }
}

/**
 * This class represents one of the piles of pieces in an auxiliary board.
 */
class AuxiliaryBoardSlot {

    constructor(scene, maxPieces, player, colNumber, piecePrimitive, type, boardPrimitive) {

        this.pieces = [];
        let addition;

        // addition is used for piece positioning purposes
        if (type == -1) {
            addition = 0;
        }
        else {
            addition = maxPieces - 1;
        }

        // Add moving pieces to the slot's storage
        for (let i = 0; i < maxPieces; i++) {
            this.pieces.push(new MovingPiece(scene, piecePrimitive, player, boardPrimitive.getPosition(...[colNumber, addition + type * 1.37, i, "octagon"])));
        }

    }

    /**
     * @method display
     * 
     * Display the pieces of the slot
     */
    display() {

        for (let i = 0; i < this.pieces.length; i++) {

            this.pieces[i].display();

        }
    }

}