/**
 * Classe Move represents a game move that as an horizontal coordinate and a vertical coordinate 
 */
class Move {

    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    /**
     * @method toString
     * 
     * Returns the move in the format xCoord-yCoord
     */
    toString(){

        return this.x + "-" + this.y;
    }


}