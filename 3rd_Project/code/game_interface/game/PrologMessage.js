
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

        console.log("Plog reply text: " + this.responseText);
        console.log("Plog reply status: " + this.status); 

        let moveStringArr = responseText.substring(1, responseText.length - 1).split(',');
        let moveArr = moveStringArr.map(PrologInterface.parseMoveFromProlog);
        
        console.log(moveArr);

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

    handleReply(){

        let responseText = this.responseText;

        console.log("Plog reply text: " + this.responseText);
        console.log("Plog reply status: " + this.status); 

        let move = PrologInterface.parseMoveFromProlog(responseText);
        
        console.log(move);

        // this.callback(move);
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

    handleReply(){
        
        console.log("Plog reply text: " + this.responseText);
        console.log("Plog reply status: " + this.status); 


        // this.callback(this.responseText);
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
        
        console.log("Plog reply text: " + httpRequest.responseText);
        // console.log("Plog reply status: " + this.status); 

        let gamestate = PrologInterface.parseGamestateFromProlog(httpRequest.responseText);
        console.log(gamestate);

        this.callback(gamestate);
    }

}