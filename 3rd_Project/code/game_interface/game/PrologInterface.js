class PrologInterface {


    static sendRequest(requestMsg,port) {

        let requestPort = port || 8081
        let request = new XMLHttpRequest();
        let requestURL = 'http://localhost:'.concat(requestPort).concat('/').concat(requestMsg.getRequest());
        request.open('GET', requestURL, true);
        request.addEventListener("load", requestMsg.handleReply.bind(requestMsg,request));
        request.setRequestHeader("Content-type", "text/plain; charset=UTF-8");
        request.send();

    }

    static parseMoveFromProlog(move){

        console.log(move);
        let x,y;

        x = parseInt(move.substring(0,move.indexOf('-')));
        y = parseInt(move.substring(move.indexOf('-') +1, move.length));

        return [x,y];

    }

    static parseGamestateToProlog(gameState) {

        let board = gameState.boardMatrix;
        let p1Type = gameState.p1Type;
        let p2Type = gameState.p2Type;
        let cutInfo = gameState.cutInfo;

        let resultArray = [board['octagonBoard'], board['squareBoard'], board['height'], board['width'], 'P1PLACEHOLDER', 'P2PLACEHOLDER', gameState.nextPlayer,'CUTINFOPLACEHOLDER'];
        let plogString = JSON.stringify(resultArray);
        
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

        let boardMatrix = [];
        boardMatrix['octagonBoard'] = gsArrays[0];
        boardMatrix['squareBoard'] = gsArrays[1];
        boardMatrix['height'] = gsInfo[0];
        boardMatrix['width'] = gsInfo[1];

        return new GameState(boardMatrix,gsInfo[2],gsInfo[3],gsInfo[4],gsInfo[5]);

    }

}