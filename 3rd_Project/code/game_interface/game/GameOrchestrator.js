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

        PrologInterface.sendRequest(new PMsg_ResetGamestate(8, 8, 'P', 'P', this.resetGamestate.bind(this)));
    }

    handlePicking(results) {

        if (results != null && results.length > 0) { // any results?

            for (var i = 0; i < results.length; i++) {
                var obj = results[i][0]; // get object from result
                if (obj) { // exists?
                    var uniqueID = results[i][1] // get id
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
            console.log(obj);

        }

    }

    handleComponentPicking(component) {

        switch (component.pickID) {

            case 'special_undo_move':

                this.undoMove();
                break;

            case 'special_play_movie':
        
                break;

            case 'special_go_to_menu':

                break;

            default:
                break;
        }

    }

    resetGamestate(gamestate) {

        this.board = new Board(this.scene, this.primitives, gamestate.boardMatrix['width'], gamestate.boardMatrix['height']);
        this.board.fillBoards(gamestate.boardMatrix['octagonBoard'], gamestate.boardMatrix['squareBoard']);
        this.sequence = new GameSequence(gamestate);
        this.orchestratorReady = true;
    }

    updateGamestate(){

        this.board.fillBoards(this.sequence.getCurrentGamestate().boardMatrix['octagonBoard'], this.sequence.getCurrentGamestate().boardMatrix['squareBoard']);
        this.state = 'DEFAULT';
        this.pickingEnabled = true;
    }

    applyMove(gamestate) {

        if(!gamestate){
            return;
        }

        let previousGamestate = this.sequence.getCurrentGamestate();
        this.sequence.addGamestate(gamestate);
        PrologInterface.sendRequest(new PMsg_IsGameover(this.sequence.getCurrentGamestate(), this.logGameover.bind(this)));
        
        this.pickingEnabled = false;
        this.board.auxBoards.startAnimation(previousGamestate.nextPlayer,gamestate.previousMove);
        this.state = 'ON_ANIMATION';
    }

    refreshGamestate(inMovie) {

        if (inMovie) {
            let boardMatrix = this.sequence.getNextMovieGamestate().boardMatrix;
            this.board.fillBoards(boardMatrix['octagonBoard'], boardMatrix['squareBoard']);
        }
        else {

            this.board.fillBoards(this.sequence.getCurrentGamestate().boardMatrix['octagonBoard'], this.sequence.getCurrentGamestate().boardMatrix['squareBoard']);
        }

    }

    logGameover(text) {

        console.log(text);
    }

    undoMove() {

        this.sequence.undo();
        this.refreshGamestate(false);
    }

    playMovie() {
        this.refreshGamestate(true);
    }

    update(time) {

        if (!this.orchestratorReady)
            return;

        var deltaT = time - this.lastT
        this.lastT = time;

        this.theme.update(deltaT);

        if(this.state == 'ON_ANIMATION'){

            this.board.auxBoards.update(deltaT);
            
            if(!this.board.auxBoards.animationOnGoing()){
                
                this.updateGamestate();
                
            }
        }
           
    }

    display() {

        if (!this.orchestratorReady)
            return;

        this.theme.display();

    }
}