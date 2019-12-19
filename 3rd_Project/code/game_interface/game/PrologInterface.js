class PrologInterface {

    getValidMoves(Gamestate) {
        let plogGamestateArrayStr = this.parseGamestateToProlog(Gamestate);

        let requestStr = "valid_moves(" + plogGamestateArrayStr + ")";
        this.sendRequest(requestStr, 'getValidMoves', null, null);
    }

    getBotMove(Gamestate,level){

        let plogGamestateArrayStr = this.parseGamestateToProlog(Gamestate);
        let requestStr = "(" + plogGamestateArrayStr + ")";

        if(level == 1){
            
            requestStr = "random_move" + requestStr;
        }
        else if (level == 2){
            
            requestStr = "greedy_move" + requestStr;
        }
        
        console.log(plogGamestateArrayStr);

        this.sendRequest(requestStr, 'getBotMove', null, null);
    }

    isGameover(Gamestate) {
        let plogGamestateArrayStr = this.parseGamestateToProlog(Gamestate);

        let requestStr = "gameover(" + plogGamestateArrayStr + ")";
        this.sendRequest(requestStr, 'getGameover', null, null);
    }

    applyMove(Gamestate, move) {

        let plogGamestateArrayStr = this.parseGamestateToProlog(Gamestate);
        let plogMoveStr  = move.toString();

        let requestStr = "move(" + plogMoveStr + ',' + plogGamestateArrayStr +")";
        this.sendRequest(requestStr, 'doMove', null, null);

    }

    sendRequest(requestStr, type, orchestrator,port) {

        let requestPort = port || 8081
        let request = new XMLHttpRequest();
        let requestURL = 'http://localhost:'.concat(requestPort).concat('/').concat(requestStr);
        request.open('GET', requestURL, true);
        request.addEventListener("load", this.parseReply.bind(request,type,orchestrator));
        request.setRequestHeader("Content-type", "text/plain; charset=UTF-8");
        request.send();

    }

    // (OctagonBoard, SquareBoard, Height, Width, P1Type, P2Type, Player, CutInfo), 
    parseGamestateToProlog(gameState) {

        let octagonBoard = [];
        let squareBoard = [];
        let p1Type = gameState.p1Type;
        let p2Type = gameState.p2Type;
        let cutInfo = gameState.cutInfo;


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

        let resultArray = [octagonBoard, squareBoard, gameState.board.height, gameState.board.width, 'P1PLACEHOLDER', 'P2PLACEHOLDER', gameState.nextPlayer,'CUTINFOPLACEHOLDER'];
        let plogString = JSON.stringify(resultArray);
        plogString = plogString.replace(/"/g, "");
        plogString = (typeof p1Type == 'number') ? plogString.replace("P1PLACEHOLDER",p1Type) : plogString.replace("P1PLACEHOLDER","'"+ p1Type + "'");
        plogString = (typeof p2Type == 'number') ? plogString.replace("P2PLACEHOLDER",p2Type) : plogString.replace("P2PLACEHOLDER","'"+ p2Type + "'");
        plogString = plogString.replace("CUTINFOPLACEHOLDER",cutInfo);

        return plogString;

    }

    parseReply(type, orchestrator) {

        if(type == 'getValidMoves'){

        }
        else if(type == 'getBotMove'){

        }
        else if(type == 'getGameover'){
            
        }
        else if(type == 'doMove'){
            
        }
        
    }


}