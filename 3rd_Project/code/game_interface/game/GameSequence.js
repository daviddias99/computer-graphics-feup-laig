class GameSequence {
    
    constructor(initialGamestate){

        this.states = [initialGamestate];
        this.currentMovieState = 0;
        this.inMovie = false;
    }

    addGamestate(gamestate){

        this.states[0].nextMove = gamestate.previousMove;
        this.states.unshift(gamestate);
    }


    getInitialGamestate(){
        return this.states[this.states.length  -1];
    }

    getCurrentGamestate(){

        return this.states[0];
    }

    getPreviousGamestate(){

        if(this.states.length > 1)
            return this.states[1];
    }

    undo(){

        if(this.states.length > 1) {

            this.states.shift();
            return true;
        }
        else{

            return false;
        }

    }

    getMovieGamestate(){

        return this.states[this.currentMovieState];
    }

    stepMovieGamestate(){

        if(!this.inMovie)
            return false;

        this.currentMovieState--;

        if(this.currentMovieState == 0){

            this.inMovie = false;
        }

        return true;
    }

    startMovie(){

        this.inMovie = true;
        this.currentMovieState = this.states.length  - 1;
    }

}