class GameOrchestrator {

    constructor(scene) {

        this.scene = scene;
        this.state = 'DEFAULT';
        this.theme = new GameTheme(null, scene, this);
        this.orchestratorReady = false;
        this.pickingEnabled = true;
    }

    init() {

        let oct_radius = 0.2;
        let sqr_radius = Math.sqrt(Math.pow(oct_radius * Math.sin(Math.PI / 8.0) * 2.0, 2) / 2.0);

        this.primitives = [
            new TilePrimitive(this.scene, oct_radius, 8, this.theme.tileMaterials[0]),          // octogonal tile
            new PiecePrimitive(this.scene, oct_radius, 8, 0.05, this.theme.playerMaterials),   // octogonal piece
            new TilePrimitive(this.scene, sqr_radius, 4, this.theme.tileMaterials[1]),          // square tile
            new PiecePrimitive(this.scene, sqr_radius, 4, 0.05, this.theme.playerMaterials)    // square piece
        ];

        PrologInterface.sendRequest(new PMsg_ResetGamestate(4, 4, 'P', 'P', this.resetGame.bind(this)));
    }

    handlePicking(results) {

        // any results?
        if (results != null && results.length > 0) { 

            for (var i = 0; i < results.length; i++) {
                // get object from result
                var obj = results[i][0]; 

                if (obj) { 
                    var uniqueID = results[i][1] 
                    this.onObjectSelected(obj, uniqueID);
                }
            }
            // clear results
            results.splice(0, results.length);
        }
    }

    onObjectSelected(obj, uniqueID) {


        if(!this.pickingEnabled)
            return;

        if (obj instanceof Tile) {

            let pos = obj.getBoardPosition();
            let move = new Move(...pos);
            let currentGamestate = this.sequence.getCurrentGamestate();
            PrologInterface.sendRequest(new PMsg_ApplyMove(currentGamestate,move, this.applyMove.bind(this)));

        }
        else if (obj instanceof MenuButton) {
            console.log("Button clicked");
        }
        else if (obj instanceof MySceneComponent) {
            console.log("Component clicked");

            this.handleComponentPicking(obj);
        }

    }

    handleComponentPicking(component) {

        switch (component.pickID) {

            case 'special_undo_move':

                this.undoMove();
                break;

            case 'special_play_movie':
            
                this.playMovie();
                break;

            case 'special_go_to_menu':

                break;

            case 'special_reset':
            
                break;

            default:
                break;
        }

    }

    startAnimation(player,move){

        this.pickingEnabled = false;
        this.board.startAnimation(player,move);
        this.state = 'ON_ANIMATION';
    }

    resetGame(initialGamestate) {

        this.resetBoard(initialGamestate);
        this.sequence = new GameSequence(initialGamestate);
        this.orchestratorReady = true;
    }

    resetBoard(initialGamestate){
        this.board = new Board(this.scene, this.primitives, initialGamestate.boardMatrix['width'], initialGamestate.boardMatrix['height']);
        this.board.fillBoards(initialGamestate.boardMatrix['octagonBoard'], initialGamestate.boardMatrix['squareBoard']);
    }

    applyMove(gamestate) {

        if(!gamestate)
            return;
        
        let previousGamestate = this.sequence.getCurrentGamestate();
        this.sequence.addGamestate(gamestate);
        PrologInterface.sendRequest(new PMsg_IsGameover(gamestate, this.logGameover.bind(this)));
        
        this.startAnimation(previousGamestate.nextPlayer,gamestate.previousMove);
    }

    refreshGamestate(inMovie) {

        if (inMovie) {
            let boardMatrix = this.sequence.getMovieGamestate().boardMatrix;
            this.board.fillBoards(boardMatrix['octagonBoard'], boardMatrix['squareBoard']);
            this.stepMovie();    
        }
        else {

            this.board.fillBoards(this.sequence.getCurrentGamestate().boardMatrix['octagonBoard'], this.sequence.getCurrentGamestate().boardMatrix['squareBoard']);
            this.state = 'DEFAULT';
            this.pickingEnabled = true;
        }

    }

    stepMovie(){

        let currentGamestate = this.sequence.getMovieGamestate();
        this.sequence.stepMovieGamestate();
        this.startAnimation(currentGamestate.nextPlayer,currentGamestate.nextMove);
    }

    playMovie() {

        this.pickingEnabled = false;
        
        // Go back to initial state

        this.sequence.startMovie();
        this.resetBoard(this.sequence.getMovieGamestate());
        this.stepMovie();    
    }

    undoMove() {

        let previousGamestate = this.sequence.getPreviousGamestate();

        if(!this.sequence.undo())
            return;

        this.refreshGamestate(false);
        this.startAnimation(previousGamestate.nextPlayer,"undo");
    }

    logGameover(text) {

        console.log(text);
    }

    update(time) {

        this.theme.update(time);

        if (!this.orchestratorReady)
            return;
            
        var deltaT = time - this.lastT
        this.lastT = time;

        if(this.state == 'ON_ANIMATION'){

            this.board.auxBoards.update(deltaT);
            
            if(!this.board.auxBoards.animationOnGoing()){
                            
                this.refreshGamestate(this.sequence.inMovie)
            }
        }
    }

    display() {

        if (!this.orchestratorReady)
            return;

        this.theme.display();

    }
}