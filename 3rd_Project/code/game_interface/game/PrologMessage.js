
class PrologMessage{


    

}

class PMsg_GetValidMoves extends PrologMessage{

    constructor(plog_gamestate){

        this.plog_gamestate =  plog_gamestate;

    }

    getRequest(){
        
        let plogGamestateArrayStr = this.parseGamestateToProlog(Gamestate);
        let requestStr = "valid_moves(" + plogGamestateArrayStr + ")";

        return requestStr;
    }

}

class PMsg_GetBotMove extends PrologMessage{

    constructor(plog_gamestate,botType){

        this.plog_gamestate =  plog_gamestate;
        this.botType = botType;

    }

    getRequest(){
        
        let plogGamestateArrayStr = this.parseGamestateToProlog(this.plog_gamestate);
        let requestStr = "(" + plogGamestateArrayStr + ")";

        if (this.level == 1) {

            requestStr = "random_move" + requestStr;
        }
        else if (this.level == 2) {

            requestStr = "greedy_move" + requestStr;
        }

        return requestStr;
    }

}

class PMsg_IsGameover extends PrologMessage{

    constructor(plog_gamestate){

        this.plog_gamestate =  plog_gamestate;

    }

    getRequest(){
        
        let plogGamestateArrayStr = this.parseGamestateToProlog(this.plog_gamestate);

        let requestStr = "gameover(" + plogGamestateArrayStr + ")";

        return requestStr;
    }

}

class PMsg_applyMove extends PrologMessage{

    constructor(plog_gamestate,move){

        this.plog_gamestate =  plog_gamestate;
        this.move = move;

    }

    getRequest(){
        
        let plogGamestateArrayStr = this.parseGamestateToProlog(this.plog_gamestate);
        let plogMoveStr  = this.move.toString();

        let requestStr = "move(" + plogMoveStr + ',' + plogGamestateArrayStr +")";

        return requestStr;
    }

}