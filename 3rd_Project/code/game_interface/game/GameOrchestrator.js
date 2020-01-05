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
            new GameTheme('wwe.xml', scene, this)
        ];
        this.inMenu = true;

        this.botPlayRequested = false;
        
        this.initOverlays();
    }

    initOverlays() {
        this.overlayShader = new CGFshader(this.scene.gl, 'shaders/overlay_shader.vert', 'shaders/overlay_shader.frag');
        this.timer = new OverlayTimer(this.scene);
        this.scoreboard = new OverlayScoreboard(this.scene);
        this.gameover_overlay = new OverlayGameOver(this.scene);
    }

    initInterface() {
        this.boardHeight = 8;
        this.boardWidth = 8;
        this.player1 = 'P';
        this.player2 = 'P';

        let gui = this.scene.interface.gui;

        let themePicker = gui.add(this, 'themeIndex', { Magic: 1, WWE: 2 }).name('Theme');
        themePicker.onChange(function (value) {
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

    setActiveTheme(index,fromMenu) {
        this.themeIndex = index;
        if (this.inMenu)
            return;

        this.themes[index].onGraphLoaded();
        this.currentTheme = this.themes[index];
        this.board.changeMaterials(this.currentTheme.boardMaterials);

        this.primitives[0].changeMaterials(this.currentTheme.tileMaterials[0]);
        this.primitives[2].changeMaterials(this.currentTheme.tileMaterials[1]);
        this.primitives[1].changeMaterials(this.currentTheme.playerMaterials);
        this.primitives[3].changeMaterials(this.currentTheme.playerMaterials);

        if(this.sequence.getCurrentGamestate().getNextPlayerType() == 'P' && !fromMenu){

            this.currentTheme.rotateCamera(this.sequence.getCurrentGamestate().nextPlayer,true);
        }
    }

    init() {

        const oct_radius = 0.2;
        const sqr_radius = Math.sqrt(Math.pow(oct_radius * Math.sin(Math.PI / 8.0) * 2.0, 2) / 2.0);
        const piece_height = 0.05;

        this.primitives = [
            new TilePrimitive(this.scene, oct_radius, 8, this.currentTheme.tileMaterials[0]),               // octogonal tile
            new PiecePrimitive(this.scene, oct_radius, 8, piece_height, this.currentTheme.playerMaterials), // octogonal piece
            new TilePrimitive(this.scene, sqr_radius, 4, this.currentTheme.tileMaterials[1]),               // square tile
            new PiecePrimitive(this.scene, sqr_radius, 4, piece_height, this.currentTheme.playerMaterials)  // square piece
        ];

        PrologInterface.sendRequest(new PMsg_ResetGamestate(this.boardHeight, this.boardWidth, this.player1, this.player2, this.resetGame.bind(this)));
    }

    resetGame(initialGamestate) {


        this.resetBoard(initialGamestate);
        this.sequence = new GameSequence(initialGamestate);
        this.orchestratorReady = true;
        this.gameover = false;

        let currentGamestate = this.sequence.getCurrentGamestate()


        if(currentGamestate.getNextPlayerType() == 'P'){

            this.currentTheme.rotateCamera(this.sequence.getCurrentGamestate().nextPlayer,true);
        }
        else if (currentGamestate.botCount() == 1){
           
            this.currentTheme.rotateCamera(currentGamestate.getHumanPlayerNumber(),true);
        }
    }

    resetBoard(initialGamestate) {
        this.board = new Board(this.scene, this.primitives, initialGamestate.boardMatrix['height'], initialGamestate.boardMatrix['width'], this.currentTheme.boardMaterials);
        this.board.fillBoards(initialGamestate.boardMatrix['octagonBoard'], initialGamestate.boardMatrix['squareBoard']);
        this.scoreboard.addBoard(this.board);
    }

    processPickingResults(results) {

        // any results?
        if (results != null && results.length > 0) {

            for (var i = 0; i < results.length; i++) {
                // get object from result
                var obj = results[i][0];

                if (obj) {
                    this.handlePicking(obj);
                }
            }
            // clear results
            results.splice(0, results.length);
        }
    }

    handlePicking(obj) {

        if (!this.pickingEnabled)
            return;

        if (obj instanceof Tile) {

            this.handleTilePicking(obj);

        }
        else if (obj instanceof MySceneComponent) {

            this.handleComponentPicking(obj);
        }

    }

    handleTilePicking(tile) {

        if (this.sequence.getCurrentGamestate().getNextPlayerType() != 'P' || this.inMenu)
            return;

        let pos = tile.getBoardPosition();

        this.doGenericMove(pos);
    }

    transitionToMenu() {
        this.init();
        this.timer.reset();
        let previousTheme = this.themeIndex;
        this.setActiveTheme(0);
        this.inMenu = true;
        this.themeIndex = previousTheme;
    }

    transitionFromMenu() {
        this.currentTheme.destroyInterface();
        this.init();
        this.inMenu = false;
        this.setActiveTheme(this.themeIndex,true);
        this.timer.start();
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
                this.transitionToMenu();
                break;

            case 'special_reset':
                this.resetGame(this.sequence.getInitialGamestate());
                break;

            case 'special_button_play':
                this.transitionFromMenu();
                break;

            default:
                break;
        }

    }

    applyMove(gamestate) {

        if (!gamestate)
            return;

        let previousGamestate = this.sequence.getCurrentGamestate();
        this.sequence.addGamestate(gamestate);
        PrologInterface.sendRequest(new PMsg_IsGameover(gamestate, this.handleGameover.bind(this)));

        this.startAnimation(previousGamestate.nextPlayer, gamestate.previousMove);
        this.botPlayRequested = false;
    }

    doGenericMove(pos) {

        if (this.gameover)
            return;
        
        this.pickingEnabled = false;

        let move = new Move(...pos);
        let currentGamestate = this.sequence.getCurrentGamestate();
        PrologInterface.sendRequest(new PMsg_ApplyMove(currentGamestate, move, this.applyMove.bind(this)));
    }

    doBotMove() {

        let currentGamestate = this.sequence.getCurrentGamestate();
        PrologInterface.sendRequest(new PMsg_GetBotMove(currentGamestate, currentGamestate.getNextPlayerType(), this.doGenericMove.bind(this)));
    }

    startAnimation(player, move) {

        this.pickingEnabled = false;
        this.board.startAnimation(player, move);
        this.state = 'ON_ANIMATION';
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

        if (!this.sequence.startMovie())
            return;

        this.timer.pause();

        this.pickingEnabled = false;

        // Go back to initial state
        this.resetBoard(this.sequence.getMovieGamestate());
        this.stepMovie();
    }

    undoMove() {

        let previousGamestate = this.sequence.getPreviousGamestate();

        if (!this.sequence.undo())
            return;

        this.gameover = false;

        this.refreshGamestate(false);

        if(this.sequence.getCurrentGamestate().getNextPlayerType() == 'P'){

            this.currentTheme.rotateCamera(this.sequence.getCurrentGamestate().nextPlayer);
        }
        
        this.startAnimation(previousGamestate.nextPlayer, "undo");
    }

    handleGameover(gameoverStatus) {
        this.scoreboard.update();

        if (gameoverStatus == 'false')
            return;

        let winningPlayer = gameoverStatus;
        this.gameover = true;
        this.timer.pause();
        this.gameover_overlay.changeTexture(winningPlayer);
    }

    update(time) { 

        if (!this.orchestratorReady)
            return;

        this.themes.forEach(function(obj){obj.update(time)});

        var deltaT = time - this.lastT
        this.lastT = time;


        this.timer.update(time);

        if (this.state == 'ON_ANIMATION') {
            this.board.auxBoards.update(deltaT);

            if (!this.board.auxBoards.animationOnGoing()) {

                this.refreshGamestate(this.sequence.inMovie)

                if(this.sequence.getCurrentGamestate().getNextPlayerType() == 'P' && !this.sequence.inMovie){

                    this.currentTheme.rotateCamera(this.sequence.getCurrentGamestate().nextPlayer);
                }
            }
            this.scoreboard.update();
        }
        else if (this.sequence.getCurrentGamestate().getNextPlayerType() != 'P' && !this.botPlayRequested && !this.gameover && !this.inMenu) {

            this.botPlayRequested = true;
            this.doBotMove();
        }

        if (this.timer.isPaused && !this.sequence.inMovie && !this.inMenu && !this.gameover)
            this.timer.start();

    }

    display() {
        if (!this.orchestratorReady)
            return;

        this.currentTheme.display();

        this.displayOverlays();
    }

    displayOverlays() {
        if (this.inMenu)
            return;

        this.scene.setActiveShader(this.overlayShader);
        this.scene.gl.disable(this.scene.gl.DEPTH_TEST);

        this.timer.display();
        this.scoreboard.display();

        if (this.gameover)
            this.gameover_overlay.display();

        this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}