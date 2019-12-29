class GameSequence {
    
    constructor(initialGamestate){

        this.states = [initialGamestate];
        this.currentMovieState = 0;
    }

    addGamestate(gamestate){

        this.states.unshift(gamestate);
    }

    getCurrentGamestate(){

        return this.states[0];
    }

    undo(){

        if(this.states.length > 1) 
            this.states.shift();

        return this.getCurrentGamestate();
    }

    getNextMovieGamestate(){

        this.currentMovieState--;

        if(this.currentMovieState == -1){
            this.currentMovieState = this.states.length  -1;
        }

        return this.states[this.currentMovieState];
    }

}