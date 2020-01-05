/**
 * Class that represents a gamestate of the game Squex.
 */
class GameState {

    constructor(boardMatrix, p1Type, p2Type, nextPlayer, cutInfo) {

        // For information about the meaning of these elements consult the prolog implementation
        this.boardMatrix = boardMatrix;
        this.p1Type = p1Type;
        this.p2Type = p2Type;
        this.nextPlayer = nextPlayer;
        this.cutInfo = cutInfo;

        // These parameters are extra from the prolog implementation. Previous move represents the move that lead to this gamestate and next move the move that
        // was played after this gamestate
        this.previousMove = null;
        this.nextMove = null;

    }

    /**
     * @method getNextPlayerType
     * 
     * Get the type of the next player. Possible values are 'P' for player and 1 or 2 for levels 1-2 bot
     */
    getNextPlayerType() {

        if (this.nextPlayer == 1) {

            return this.p1Type;
        }
        else {
            return this.p2Type;
        }
    }

    /**
     * @methods botCount
     * 
     * Get the number of bot players that are in the game. May be 0, 1 or 2
     */
    botCount() {

        let count = 0;

        if (this.p1Type != 'P')
            count++;

        if (this.p2Type != 'P')
            count++;

        return count;
    }

    /**
     * @method getHumanPlayerNumber
     * 
     * Return the number of the player that is Human. Might be 1 or 2. This function is only meant to be used in a Player v. Bot game, in any other case
     * it will return false.
     */
    getHumanPlayerNumber() {

        if (this.botCount() != 1)
            return false;

        if (this.p1Type == 'P')
            return 1;
        else
            return 2;

    }

    /**
     * @function findMove Find what Move (see class Move) corresponds to these two consecutive gamestates (nextMove of previousGs and previousMove of nextGs).
     * @param {GameState} previousGs 
     * @param {GameState} nextGs 
     */
    static findMove(previousGs, nextGs) {

        let prevOctBoard = previousGs.boardMatrix['octagonBoard'];
        let nextOctBoard = nextGs.boardMatrix['octagonBoard'];


        // The move will be the cell of the oct board where the two gamestates differ as only one cell of the octagon board may change between consecutive states.

        for (let i = 0; i < prevOctBoard.length; i++) {

            for (let j = 0; j < prevOctBoard[0].length; j++) {

                if (prevOctBoard[i][j] != nextOctBoard[i][j]) {
                    return new Move(j, i);
                }
            }
        }

    }

    /**
     * Build the board matrix from a Board class.
     * @param {Board} board 
     */
    buildMatrixFromBoard(board) {

        this.boardMatrix = [];
        let octagonBoard = [];
        let squareBoard = [];

        // Find what octagons have a piece.

        for (let i = 0; i < board.octagons.length; i++) {

            let row = [];

            for (let j = 0; j < board.octagons[i].length; j++) {

                let octagon = board.octagons[i][j];

                row[j] = octagon.piece == null ? 0 : octagon.piece.player;
            }

            octagonBoard[i] = row;
        }

        // Find what squares have a piece.

        for (let i = 0; i < board.squares.length; i++) {

            let row = [];

            for (let j = 0; j < board.squares[i].length; j++) {

                let square = board.squares[i][j];

                row[j] = square.piece == null ? 0 : square.piece.player;
            }

            squareBoard[i] = row;
        }

        this.boardMatrix['octagonBoard'] = octagonBoard;
        this.boardMatrix['squareBoard'] = squareBoard;
        this.boardMatrix['width'] = board.cols;
        this.boardMatrix['height'] = board.rows;

    }

}