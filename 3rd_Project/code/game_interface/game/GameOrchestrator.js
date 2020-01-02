class GameOrchestrator {

    constructor(scene) {

        this.scene = scene;
        this.state = 'DEFAULT';
        this.orchestratorReady = false;
        this.pickingEnabled = true;

        this.loadedThemes = 0;
        this.themeIndex = 1;
        this.themes = [
            new GameMenu(scene, this),
            new GameTheme('main_scene.xml', scene, this),
            new GameTheme('test_scenes/board.xml', scene, this)
        ];
        this.inMenu = true;

        this.boardHeight = 4;
        this.boardWidth = 4;
        this.player1 = 'P';
        this.player2 = 'P';
    }

    initInterface() {
        let gui = this.scene.interface.gui;

        let themePicker = gui.add(this, 'themeIndex', {Magic: 1, WWE: 2}).name('Theme');
        themePicker.onChange(function(value) {
            this['object'].setActiveTheme(value);
        });
    }

    loadedTheme() {
        this.loadedThemes++;

        if (this.loadedThemes != this.themes.length)
            return;
        
        console.log('Loaded all themes!');
        this.initInterface();
        this.themes[0].onGraphLoaded();
        this.currentTheme = this.themes[0];
        this.init();
    }

    setActiveTheme(index) {
        this.themeIndex = index;
        if (this.inMenu)
            return;
        this.themes[index].onGraphLoaded();
        this.currentTheme = this.themes[index];
    }

    init() {

        let oct_radius = 0.2;
        let sqr_radius = Math.sqrt(Math.pow(oct_radius * Math.sin(Math.PI / 8.0) * 2.0, 2) / 2.0);

        this.primitives = [
            new TilePrimitive(this.scene, oct_radius, 8, this.currentTheme.tileMaterials[0]),          // octogonal tile
            new PiecePrimitive(this.scene, oct_radius, 8, 0.05, this.currentTheme.playerMaterials),   // octogonal piece
            new TilePrimitive(this.scene, sqr_radius, 4, this.currentTheme.tileMaterials[1]),          // square tile
            new PiecePrimitive(this.scene, sqr_radius, 4, 0.05, this.currentTheme.playerMaterials)    // square piece
        ];

        PrologInterface.sendRequest(new PMsg_ResetGamestate(this.boardHeight, this.boardWidth, this.player1, this.player2, this.resetGame.bind(this)));
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


        if (!this.pickingEnabled)
            return;

        if (obj instanceof Tile) {

            let pos = obj.getBoardPosition();
            let move = new Move(...pos);
            let currentGamestate = this.sequence.getCurrentGamestate();
            PrologInterface.sendRequest(new PMsg_ApplyMove(currentGamestate, move, this.applyMove.bind(this)));

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

                this.resetGame(this.sequence.getInitialGamestate());
                break;

            case 'special_button_play':
                this.currentTheme.destroyInterface();
                this.init();
                this.inMenu = false;
                this.setActiveTheme(this.themeIndex);
                console.log("Play button pressed");
                break;

            default:
                break;
        }

    }

    startAnimation(player, move) {
        this.pickingEnabled = false;
        this.board.startAnimation(player, move);
        this.state = 'ON_ANIMATION';
    }

    resetGame(initialGamestate) {

        this.resetBoard(initialGamestate);
        this.sequence = new GameSequence(initialGamestate);
        this.orchestratorReady = true;
    }

    resetBoard(initialGamestate) {
        this.board = new Board(this.scene, this.primitives, initialGamestate.boardMatrix['height'], initialGamestate.boardMatrix['width']);
        this.board.fillBoards(initialGamestate.boardMatrix['octagonBoard'], initialGamestate.boardMatrix['squareBoard']);
    }

    applyMove(gamestate) {

        if (!gamestate)
            return;

        let previousGamestate = this.sequence.getCurrentGamestate();
        this.sequence.addGamestate(gamestate);
        PrologInterface.sendRequest(new PMsg_IsGameover(gamestate, this.logGameover.bind(this)));

        this.startAnimation(previousGamestate.nextPlayer, gamestate.previousMove);
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

    stepMovie() {

        let currentGamestate = this.sequence.getMovieGamestate();
        this.sequence.stepMovieGamestate();
        this.startAnimation(currentGamestate.nextPlayer, currentGamestate.nextMove);
    }

    playMovie() {

        if(!this.sequence.startMovie())
            return;

        this.pickingEnabled = false;

        // Go back to initial state
        this.resetBoard(this.sequence.getMovieGamestate());
        this.stepMovie();
    }

    undoMove() {

        let previousGamestate = this.sequence.getPreviousGamestate();

        if (!this.sequence.undo())
            return;

        this.refreshGamestate(false);
        this.startAnimation(previousGamestate.nextPlayer, "undo");
    }

    logGameover(text) {

        console.log(text);
    }

    update(time) {

        if (!this.orchestratorReady)
            return;

        
        this.currentTheme.update(time);

        var deltaT = time - this.lastT
        this.lastT = time;

        if (this.state == 'ON_ANIMATION') {

            this.board.auxBoards.update(deltaT);

            if (!this.board.auxBoards.animationOnGoing()) {

                this.refreshGamestate(this.sequence.inMovie)
            }
        }
    }

    display() {

        if (!this.orchestratorReady)
            return;

        this.currentTheme.display();

    }
}