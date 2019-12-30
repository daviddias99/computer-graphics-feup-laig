class GameOrchestrator {

    constructor(scene) {

        this.scene = scene;
        this.state = 'MENU';
        this.theme = new GameTheme(null, scene, this);
        this.orchestratorReady = false;
    }

    init() {

        let oct_radius = 0.2;
        let sqr_radius = Math.sqrt(Math.pow(oct_radius * Math.sin(Math.PI / 8.0) * 2.0, 2) / 2.0);

        let primitives = [
            new TilePrimitive(this.scene, oct_radius, 8, this.theme.tileMaterials[0]),          // octogonal tile
            new PiecePrimitive(this.scene, oct_radius, 8, 0.05, this.theme.playerMaterials),   // octogonal piece
            new TilePrimitive(this.scene, sqr_radius, 4, this.theme.tileMaterials[1]),          // square tile
            new PiecePrimitive(this.scene, sqr_radius, 4, 0.05, this.theme.playerMaterials)    // square piece
        ];

        // to here
        this.board = new Board(this.scene, primitives, 4, 4);

        this.resetGamestate();

        this.orchestratorReady = true;
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


        if (obj instanceof Tile) {

            let pos = obj.getBoardPosition();
            PrologInterface.sendRequest(new PMsg_ApplyMove(this.sequence.getCurrentGamestate(), new Move(...pos), this.updateGamestate.bind(this)));
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

    resetGamestate() {

        PrologInterface.sendRequest(new PMsg_ResetGamestate(4, 4, 'P', 'P', this.resetGamestateAction.bind(this)));
    }

    resetGamestateAction(gamestate) {

        this.board.fillBoards(gamestate.boardMatrix['octagonBoard'], gamestate.boardMatrix['squareBoard']);
        this.sequence = new GameSequence(gamestate);
    }


    updateGamestate(gamestate) {

        this.board.fillBoards(gamestate.boardMatrix['octagonBoard'], gamestate.boardMatrix['squareBoard']);
        this.sequence.addGamestate(gamestate);
        PrologInterface.sendRequest(new PMsg_IsGameover(this.sequence.getCurrentGamestate(), this.logGameover.bind(this)));
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

        this.theme.update(time);
    }

    display() {

        if (!this.orchestratorReady)
            return;

        this.theme.display();

    }
}