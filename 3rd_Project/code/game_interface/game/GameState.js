class GameState {

    constructor(boardMatrix, p1Type, p2Type, nextPlayer, cutInfo){

        this.boardMatrix = boardMatrix;
        this.p1Type = p1Type;
        this.p2Type = p2Type;
        this.nextPlayer = nextPlayer;
        this.cutInfo = cutInfo;
        this.previousMove = null;
        this.nextMove = null;

    }

    getNextPlayerType(){

        if(this.nextPlayer == 1){

            return this.p1Type;
        }
        else {
            return this.p2Type;
        }


    }

    botCount(){

        let count = 0;

        if(this.p1Type != 'P')
            count++;
        
        if(this.p2Type != 'P')
            count++;

        return count;
    }

    getHumanPlayerNumber(){

        if(this.botCount() != 1)
            return false;

        if(this.p1Type == 'P')
            return 1;
        else
            return 2;

    }

    static findMove(previousGs, nextGs){

        let prevOctBoard = previousGs.boardMatrix['octagonBoard'];
        let nextOctBoard = nextGs.boardMatrix['octagonBoard'];

        for(let i = 0; i < prevOctBoard.length; i++){

            for(let j = 0; j < prevOctBoard[0].length; j++){
            
                if(prevOctBoard[i][j] != nextOctBoard[i][j]){
                    return new Move(j,i);
                }
            }
        }

    }

    buildMatrixFromBoard(board) {

        this.boardMatrix = [];
        let octagonBoard = [];
        let squareBoard = [];

        for (let i = 0; i < board.octagons.length; i++) {

            let row = [];

            for (let j = 0; j < board.octagons[i].length; j++) {

                let octagon = board.octagons[i][j];

                row[j] = octagon.piece == null ? 0 : octagon.piece.player;
            }

            octagonBoard[i] = row;
        }

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