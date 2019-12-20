class PrologInterface {


    static sendRequest(requestMsg,port) {

        let requestPort = port || 8081
        let request = new XMLHttpRequest();
        let requestURL = 'http://localhost:'.concat(requestPort).concat('/').concat(requestMsg.getRequest());
        request.open('GET', requestURL, true);
        request.addEventListener("load", requestMsg.handleReply);
        request.setRequestHeader("Content-type", "text/plain; charset=UTF-8");
        request.send();

    }

    static parseMoveFromProlog(move){

        let x,y;

        x = parseInt(move.substring(0,move.indexOf('-')));
        y = parseInt(move.substring(move.indexOf('-') +1, move.length));

        return new Move(x,y);

    }

    static parseGamestateToProlog(gameState) {

        let octagonBoard = [];
        let squareBoard = [];
        let p1Type = gameState.p1Type;
        let p2Type = gameState.p2Type;
        let cutInfo = gameState.cutInfo;


        for (let i = 0; i < gameState.board.octagons.length; i++) {

            let row = [];

            for (let j = 0; j < gameState.board.octagons[i].length; j++) {

                let octagon = gameState.board.octagons[i][j];

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
        console.log(plogString);
        console.log(JSON.parse(plogString));
        plogString = plogString.replace(/"/g, "");
        plogString = (typeof p1Type == 'number') ? plogString.replace("P1PLACEHOLDER",p1Type) : plogString.replace("P1PLACEHOLDER","'"+ p1Type + "'");
        plogString = (typeof p2Type == 'number') ? plogString.replace("P2PLACEHOLDER",p2Type) : plogString.replace("P2PLACEHOLDER","'"+ p2Type + "'");
        plogString = plogString.replace("CUTINFOPLACEHOLDER",cutInfo);

        return plogString;

    }

    static parseGamestateFromProlog(gameStateStr){

        let gsArraysStr = gameStateStr.substring(0,gameStateStr.length-1)
        let gsInfo = gsArraysStr.substring(gsArraysStr.lastIndexOf(']')+2,gsArraysStr.length);
        gsArraysStr = gsArraysStr.substring(0,gsArraysStr.lastIndexOf(']')+1) + ']';
        let gsArrays = JSON.parse(gsArraysStr);
        gsInfo = gsInfo.split(',');
        
        gsInfo[0] = parseInt(gsInfo[0]);
        gsInfo[1] = parseInt(gsInfo[1]);
        gsInfo[4] = parseInt(gsInfo[4]);


        console.log(gsArrays);
        console.log(gsInfo);

    }

}