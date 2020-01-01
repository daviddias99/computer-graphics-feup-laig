
class PrologMessage{


}

class PMsg_GetValidMoves extends PrologMessage{

    constructor(plog_gamestate,callback){

        super();
        this.callback = callback;
        this.plog_gamestate =  plog_gamestate;

    }

    getRequest(){
        
        let plogGamestateArrayStr = PrologInterface.parseGamestateToProlog(this.plog_gamestate);
        let requestStr = "valid_moves(" + plogGamestateArrayStr + ")";

        return requestStr;
    }

    handleReply(){

        let responseText = this.responseText;

        let moveStringArr = responseText.substring(1, responseText.length - 1).split(',');
        let moveArr = moveStringArr.map(PrologInterface.parseMoveFromProlog);
        
        // this.callback(moveArr);
    }

}

class PMsg_GetBotMove extends PrologMessage{

    constructor(plog_gamestate,botType,callback){

        super();
        this.callback = callback;
        this.plog_gamestate =  plog_gamestate;
        this.botType = botType;

    }

    getRequest(){
        
        let plogGamestateArrayStr = PrologInterface.parseGamestateToProlog(this.plog_gamestate);
        let requestStr = "(" + plogGamestateArrayStr + ")";

        if (this.botType == 1) {

            requestStr = "random_move" + requestStr;
        }
        else if (this.botType == 2) {

            requestStr = "greedy_move" + requestStr;
        }

        return requestStr;
    }

    handleReply(httpRequest){

        let responseText = httpRequest.responseText;
        let move = PrologInterface.parseMoveFromProlog(responseText);
        
        this.callback(move);
    }

}

class PMsg_IsGameover extends PrologMessage{

    constructor(plog_gamestate,callback){

        super();
        this.callback = callback;
        this.plog_gamestate =  plog_gamestate;

    }

    getRequest(){
        
        let plogGamestateArrayStr = PrologInterface.parseGamestateToProlog(this.plog_gamestate);

        let requestStr = "gameover(" + plogGamestateArrayStr + ")";

        return requestStr;
    }

    handleReply(httpRequest){
        
        this.callback(httpRequest.responseText);
    }

}

class PMsg_ApplyMove extends PrologMessage{

    constructor(gamestate,move,callback){

        super();
        this.callback = callback;
        this.gamestate =  gamestate;
        this.move = move;

    }

    getRequest(){
        
        let plogGamestateArrayStr = PrologInterface.parseGamestateToProlog(this.gamestate);
        let plogMoveStr  = this.move.toString();
        let requestStr = "move(" + plogMoveStr + ',' + plogGamestateArrayStr +")";

        return requestStr;
    }

    handleReply(httpRequest){
        
        let gamestate = PrologInterface.parseGamestateFromProlog(httpRequest.responseText);
        gamestate.previousMove = GameState.findMove(this.gamestate,gamestate);

        this.callback(gamestate);
    }

}

class PMsg_ResetGamestate extends PrologMessage {

    constructor(width,height, p1type, p2type, callback){

        super();
        this.callback = callback;
        this.width = width;
        this.height = height;
        this.p1Type = p1type;
        this.p2Type = p2type;

    }

    getRequest(){
        
        let requestStr = "reset_gs(" + this.height + ',' + this.width + ',' + "P1PLACEHOLDER" + ',' + "P2PLACEHOLDER" +")";
        requestStr = (typeof this.p1Type == 'number') ? requestStr.replace("P1PLACEHOLDER",this.p1Type) : requestStr.replace("P1PLACEHOLDER","'"+ this.p1Type + "'");
        requestStr = (typeof this.p2Type == 'number') ? requestStr.replace("P2PLACEHOLDER",this.p2Type) : requestStr.replace("P2PLACEHOLDER","'"+ this.p2Type + "'");

        return requestStr;
    }

    handleReply(httpRequest){

        let gamestate = PrologInterface.parseGamestateFromProlog(httpRequest.responseText);

        this.callback(gamestate);
    }
}