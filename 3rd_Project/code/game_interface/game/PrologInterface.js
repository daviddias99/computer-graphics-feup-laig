class PrologInterface {

    getValidMoves(Gamestate) {

    }

    isGameover(Gamestate) {

    }

    applyMove(Gamestate,move) {

        let plogGamestateArrayStr = this.parseGameStateToProlog(Gamestate);
        let plogMoveStr = this.parseMoveToProlog(move);

    }

    sendRequest(requestStr, type, orchestrator) {

        let request = new MyXMLHttpRequest(this);
        request.addEventListener("load", this.parseReply.bind(type, orchestrator));
        request.open('GET', 'http://localhost:' + PORT + '/' + requestString, true);
        request.setRequestHeader("Content-type", "application/x-www-formurlencoded; charset=UTF-8");
        request.send();

    }

    // (OctagonBoard, SquareBoard, Height, Width, P1Type, P2Type, Player, CutInfo), 
    parseGamestateToProlog(Gamestate){

        let octagonBoard = [];
        let squareBoard = [];
        let height = Gamestate.height;
        let width  = Gamestate.width;
        let p1Type = Gamestate.p1Type;
        let p2Type = Gamestate.p2Type;
        let nextPlayer = Gamestate.nextPlayer;
        let cutInfo = Gamestate.cutInfo;
        
        
        for (let i = 0; i < gameState.board.octogons.length; i++) {

            let row = [];

            for (let j = 0; j < gameState.board.octogons[i].length; j++) {

                let octagon = gameState.board.octogons[i][j];

                row[j] = octagon.piece == null ? 0 : octagon.piece.player;
            }

            octagonBoard[i] = row;
        }

        for (let i = 0; i < gameState.board.squares.length; i++) {

            let row = [];

            for (let j = 0; j < gameState.board.squares[i].length; j++) {

                let square = gameState.board.squares[i][j];

                row[j] = square.piece == null ? 0 : square.piece.player;
            }

            squareBoard[i] = row;
        }

        let resultArray = [octagonBoard,squareBoard,height,width,p1Type,p2Type,nextPlayer,cutInfo];
        let string = JSON.stringify(resultArray);
    }

    parseReply(type, orchestrator) {

        if (this.status === 400) {
            console.log("ERROR");
            return;
        }

        let  = this.parseFromPlog(this.responseText, true);

    }

}