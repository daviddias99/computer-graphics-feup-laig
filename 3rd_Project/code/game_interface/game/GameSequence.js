/**
 * Class representing the sequence of gamestates that are playing throughout a game.
 */
class GameSequence {
    
    /**
     * @constructor 
     * 
     * Starts a new GameSequence with an initial gamestate (usually this gamestate is the initial gamestate of a game).
     * 
     * @param {GameState} initialGamestate 
     */
    constructor(initialGamestate){

        this.states = [initialGamestate];   // The start of beggining of the array represents the most recent gamestate of the game
        this.currentMovieState = 0;
        this.inMovie = false;               // Signals if the gamesequence is currently being used to display the game movie
    }

    /**
     * @method addGamestate
     * 
     * Adds a new gamestate to the sequence. Updates the nextMove variable of the added gamestate.
     * 
     * @param {GameState} gamestate new gamestate
     */
    addGamestate(gamestate){

        this.states[0].nextMove = gamestate.previousMove;
        this.states.unshift(gamestate);
    }


    /**
     * @method getInitialGamestate
     * 
     * Get the first gamestate of the game
     */
    getInitialGamestate(){
        return this.states[this.states.length  -1];
    }

    /**
     * @method getCurrentGamestate
     * 
     * Get the current gamestate of the game
     */
    getCurrentGamestate(){

        return this.states[0];
    }

    /**
     * @method getPreviousGamestate
     * 
     * Get the previous gamestate of the game. If the game only as seen one gamestate, the function will return undefined
     */
    getPreviousGamestate(){

        if(this.states.length > 1)
            return this.states[1];
    }

    /**
     * @method undo
     * 
     * Roll back to the previous gamestate. Undo is only possible if there is at least 2 gamestates in a game. The initial gamestate cannot be undone.
     * 
     * @return true if the undo was sucessfull, false otherwise
     */
    undo(){

        if(this.states.length > 1) {

            this.states.shift();
            return true;
        }
        else{

            return false;
        }

    }

    /**
     * @method getMovieGamestate
     * 
     * Return the current movie gamestate.
     */
    getMovieGamestate(){

        return this.states[this.currentMovieState];
    }

    /**
     * @method stepMovieGamestate
     * 
     * Advance the movie to the next gamestate in the sequence. This method only works if the Movie as started with the startMovie method. If the movie ended,
     * the method will change the inMovie variable accordingly.
     * 
     * @return true if the operation was sucessfull, false otherwise.
     */
    stepMovieGamestate(){

        if(!this.inMovie)
            return false;

        this.currentMovieState--;

        // The movie reached the current state
        if(this.currentMovieState == 0){

            this.inMovie = false;
        }

        return true;
    }

    /**
     * @method startMovie
     * 
     * Start the movie processing in the sequence. Set the inMovie variable to true.
     * 
     * @return true if the movie was started sucessfuly, false otherwise
     */
    startMovie(){

        if(this.states.length == 1)
            return false;

        this.inMovie = true;
        this.currentMovieState = this.states.length  - 1;

        return true;
    }

}