class GameOrchestrator {

    constructor(scene) {
        // TODO: remove from here
        this.sqr = new CGFappearance(scene);
        this.sqr.setAmbient(0.0, 0.1, 0.0, 1);
        this.sqr.setDiffuse(0.0, 0.9, 0.0, 1);
        this.sqr.setSpecular(0.0, 0.1, 0.0, 1);
        this.sqr.setShininess(10.0);

        this.oct = new CGFappearance(scene);
        this.oct.setAmbient(0.1, 0.0, 0.0, 1);
        this.oct.setDiffuse(0.9, 0.0, 0.0, 1);
        this.oct.setSpecular(0.1, 0.0, 0.0, 1);
        this.oct.setShininess(10.0);

        this.p1 = new CGFappearance(scene);
        this.p1.setAmbient(0.0, 0.1, 0.0, 1);
        this.p1.setDiffuse(0.9, 0.9, 0.0, 1);
        this.p1.setSpecular(0.0, 0.1, 0.0, 1);
        this.p1.setShininess(10.0);

        this.p2 = new CGFappearance(scene);
        this.p2.setAmbient(0.1, 0.0, 0.0, 1);
        this.p2.setDiffuse(0.0, 0.9, 0.9, 1);
        this.p2.setSpecular(0.1, 0.0, 0.0, 1);
        this.p2.setShininess(10.0);

        let oct_radius = 0.2;
        let sqr_radius = Math.sqrt(Math.pow(oct_radius * Math.sin(Math.PI / 8.0) * 2.0, 2) / 2.0);

        let primitives = [
            new TilePrimitive(scene, oct_radius, 8, this.oct),          // octogonal tile
            new PiecePrimitive(scene, oct_radius, 8, 0.05, [null,this.p1,this.p2]),   // octogonal piece
            new TilePrimitive(scene, sqr_radius, 4, this.sqr),          // square tile
            new PiecePrimitive(scene, sqr_radius, 4, 0.05, [null,this.p1,this.p2])    // square piece
        ];

        // to here
        this.board = new Board(scene, primitives, 4, 4);
        this.theme = new GameTheme(null, scene);
        
        this.resetGamestate();

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

        console.log(obj);
        if(obj instanceof Tile) {

            let pos = obj.getBoardPosition();
            PrologInterface.sendRequest(new PMsg_ApplyMove(this.sequence.getCurrentGamestate(), new Move(...pos), this.updateGamestate.bind(this)));
        }

    }

    resetGamestate() {

        PrologInterface.sendRequest(new PMsg_ResetGamestate(4,4,'P','P',this.resetGamestateAction.bind(this)));
    }

    resetGamestateAction(gamestate) {

        this.board.fillBoards(gamestate.boardMatrix['octagonBoard'],gamestate.boardMatrix['squareBoard']);
        this.sequence = new GameSequence(gamestate);
    }


    updateGamestate(gamestate) {

        this.board.fillBoards(gamestate.boardMatrix['octagonBoard'],gamestate.boardMatrix['squareBoard']);
        this.sequence.addGamestate(gamestate);
        PrologInterface.sendRequest(new PMsg_IsGameover(this.sequence.getCurrentGamestate(),this.logGameover.bind(this)));
    }

    refreshGamestate(inMovie) {

        if(inMovie){
            let boardMatrix = this.sequence.getNextMovieGamestate().boardMatrix;
            this.board.fillBoards(boardMatrix['octagonBoard'],boardMatrix['squareBoard']);
        }
        else{

            this.board.fillBoards(this.sequence.getCurrentGamestate().boardMatrix['octagonBoard'],this.sequence.getCurrentGamestate().boardMatrix['squareBoard']);
        }
        
    }

    logGameover(text){

        console.log(text);
    }

    undoMove(){

        this.sequence.undo();
        this.refreshGamestate(false);
    }

    playMovie(){
        this.refreshGamestate(true);
    }

    update(time) {
        
        this.theme.update(time);
    }


    display() {

        this.theme.display();
        this.board.display();

    }
}