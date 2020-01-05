/**
 * GameOrchestartor is the main class that manages the flow of the squex game.
 */
class GameOrchestrator {

    constructor(scene) {
        this.scene = scene;
        this.orchestratorReady = false;
        this.pickingEnabled = true;
        this.inMenu = true;
        this.botPlayRequested = false;

        // The state of the scene might be DEFAULT or ON_ANIMATION. 
        this.state = 'DEFAULT';

        // The game has several themes one of which is fixed and is the menu theme
        this.loadedThemes = 0;
        this.themeIndex = 1;
        this.themes = [
            new GameMenu(scene, this),
            new GameTheme('main_scene.xml', scene, this),
            new GameTheme('wwe.xml', scene, this),
            new GameTheme('infinite.xml', scene, this)
        ];
        
        this.overlay = new GameOverlay(scene, this);
    }

    /**
     * @method initInterface
     * 
     * Initialize the variables that are controlled by the interface of program and create the theme chooser in dat.gui
     */
    initInterface() {
        this.boardHeight = 8;
        this.boardWidth = 8;
        this.player1 = 'P';
        this.player2 = 'P';

        let gui = this.scene.interface.gui;

        let themePicker = gui.add(this, 'themeIndex', { Magic: 1, WWE: 2, Infinite: 3 }).name('Theme');
        themePicker.onChange(function (value) {
            this['object'].setActiveTheme(value);
        });
    }

    /**
     * @method loadedTheme
     * 
     * Handler that is called when a theme as finished loading. When all themes are loaded the menu is displayed.
     */
    loadedTheme() {
        this.loadedThemes++;

        if (this.loadedThemes != this.themes.length)
            return;

        console.log('Loaded all themes!');

        // Initialize the theme choosing interface
        this.initInterface();

        // Display the menu theme (theme 0)
        this.themes[0].onGraphLoaded();
        this.currentTheme = this.themes[0];

        // Initialize the game
        this.init();
    }

    /**
     * @method setActiveTheme
     * 
     * Changes the active theme to the one represented by index
     * @param {number} index        index of the new theme
     * @param {boolean} fromMenu    true if transition is coming from the menu state
     */
    setActiveTheme(index,fromMenu) {

        this.themeIndex = index;

        // While in menu the theme may not change
        if (this.inMenu)
            return;

        // Initialize the new theme
        this.themes[index].onGraphLoaded();
        this.currentTheme = this.themes[index];

        // Update the game's materials
        this.board.changeMaterials(this.currentTheme.boardMaterials);

        this.primitives[0].changeMaterials(this.currentTheme.tileMaterials[0]);
        this.primitives[2].changeMaterials(this.currentTheme.tileMaterials[1]);
        this.primitives[1].changeMaterials(this.currentTheme.playerMaterials);
        this.primitives[3].changeMaterials(this.currentTheme.playerMaterials);

        // If the next player is a human player rotate the camera to it's position. This is needed because of theme changes during a game.
        // If the change in theme came from a menu state there is no need to rotate, because the game is reset and the camera will already rotate.
        if(this.sequence.getCurrentGamestate().getNextPlayerType() == 'P' && !fromMenu){

            this.currentTheme.rotateCamera(this.sequence.getCurrentGamestate().nextPlayer,true);
        }
    }

    /**
     * @method init
     * 
     * Initialize game and the Tile and Piece primitive objects. Send a reset game message to Prolog (get the initial gamestate).
     */
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

    /**
     * @method resetGame
     * 
     * Reset the game. Start a new gamesequence and rotate the camera to the correct place.
     * @param {GameState} initialGamestate 
     */
    resetGame(initialGamestate) {

        // Reset the game board
        this.resetBoard(initialGamestate);

        // Start a new sequence that keeps track of past gamestates and manages undos/movies
        this.sequence = new GameSequence(initialGamestate);

        this.gameover = false;

        // Get the initial gamestate
        let currentGamestate = this.sequence.getCurrentGamestate()

        // Change the camera to the correct position. This means changing the camera to the next players perspective, or if the game is Human v Bot changing
        // the camera to the only player's perpective.
        if(currentGamestate.getNextPlayerType() == 'P'){

            this.currentTheme.rotateCamera(this.sequence.getCurrentGamestate().nextPlayer,true);
        }
        else if (currentGamestate.botCount() == 1){
           
            this.currentTheme.rotateCamera(currentGamestate.getHumanPlayerNumber(),true);
        }

        // Signal that the game may begin display and update
        this.orchestratorReady = true;
    }

    /**
     * @method resetBoard
     * 
     * Reset the gameboard according to the given inital gamestate.
     * @param {GameState} initialGamestate  initial gamestate
     */
    resetBoard(initialGamestate) {
        
        // Create the board object
        this.board = new Board(this.scene, this.primitives, initialGamestate.boardMatrix['height'], initialGamestate.boardMatrix['width'], this.currentTheme.boardMaterials);
        
        // As this is a start of a game the initial state does not need animations and can be done right away
        this.board.fillBoards(initialGamestate.boardMatrix['octagonBoard'], initialGamestate.boardMatrix['squareBoard']);

        // Update the scoreboards reference to the board
        this.overlay.scoreboard.addBoard(this.board);
    }

    /**
     * @method processPickingResults
     * 
     * Process the pciking results array. (This function was provided by the teacher, with some minor modifications)
     * @param {array} results picking results 
     */
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

    /**
     * @method handlePicking
     * 
     * Handle object picking by calling the correct function given the type of the picked object.
     * @param {*} obj       Object that was picked 
     */
    handlePicking(obj) {

        // If picking is disabled, do nothing
        if (!this.pickingEnabled)
            return;

        if (obj instanceof Tile) {

            this.handleTilePicking(obj);

        }
        else if (obj instanceof MySceneComponent) {

            this.handleComponentPicking(obj);
        }

    }

    /**
     * @method handleTilePicking
     * 
     * Handle tile picking. Picking a tile, when in a player turn, results in doing a game move.
     * @param {Tile} tile picked tile
     */
    handleTilePicking(tile) {

        // If we game is in the menu or a it's a bot's turn. Do nothing
        if (this.sequence.getCurrentGamestate().getNextPlayerType() != 'P' || this.inMenu)
            return;

        // Get the board position that was picked (game coordinates)
        let pos = tile.getBoardPosition();

        // Do a move
        this.doGenericMove(pos);
    }

    /**
     * @method transitionToMenu
     * 
     * Handle the transition from a game-playing state to the menu
     */
    transitionToMenu() {

        // Init the board that is displayed on the menu
        this.init();

        // Reset the overlay timer
        this.overlay.timer.reset();

        // Handle theme change
        let previousTheme = this.themeIndex;
        this.setActiveTheme(0);
        this.inMenu = true;
        this.themeIndex = previousTheme;
    }

    /**
     * @method transitionFromMenu
     * 
     * Handle the transition from the menu to a game-playing state 
     */
    transitionFromMenu() {

        // Remove the extra elements from the interface
        this.currentTheme.destroyInterface();

        // Initialize the needed primitive objects and reset the game by signaling the Prolog server
        this.init();

        // Handle theme change
        this.inMenu = false;
        this.setActiveTheme(this.themeIndex,true);

        // Start the game timer
        this.overlay.timer.start();
    }

    /**
     * @method handleComponentPicking
     * 
     * Call the correct function given the id of the component that was picked. The game supports 5 objects one of which are: undo object, reset game object,
     * play movie object, go to menu object, and the play button object. These objects are identified by there unique picking id (special_undo_move,special_play_movie,
     * special_go_to_menu, special_reset and special_button_play). Note that the play button object should be exclusive to the menu.
     * @param {MySceneComponent} component component that was picked 
     */
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

    /**
     * @method applyMove
     * 
     * This method is a callback for the apply move message to the prolog server. This method adds the new gamestate to
     * the sequence and starts the animation corresponding to the move. It also sends a message to check for gameover.
     * 
     * @param {GameState} gamestate         new game state 
     */
    applyMove(gamestate) {

        if (!gamestate)
            return;

        let previousGamestate = this.sequence.getCurrentGamestate();

        // Add new gamestate to the sequence
        this.sequence.addGamestate(gamestate);

        // Check for gameover
        PrologInterface.sendRequest(new PMsg_IsGameover(gamestate, this.handleGameover.bind(this)));

        // Start the piece animation
        this.startAnimation(previousGamestate.nextPlayer, gamestate.previousMove);
        this.botPlayRequested = false;
    }

    /**
     * @method doGenericMove
     * 
     * This method takes a given board position and sends the apply move message to the Prolog Server, using the applyMove method as a callback
     * @param {array} pos   position of the tile that corresponds to the move 
     */
    doGenericMove(pos) {

        // If the game is over no picking is allowed
        if (this.gameover)
            return;
        
        // Disabling picking until move animation is over
        this.pickingEnabled = false;

        let move = new Move(...pos);
        let currentGamestate = this.sequence.getCurrentGamestate();

        // Send a message to prolog to find the gamestate that results from the given move
        PrologInterface.sendRequest(new PMsg_ApplyMove(currentGamestate, move, this.applyMove.bind(this)));
    }

    /**
     * @method doBotMove
     * 
     * Send the get bot move message to the prolog server and execute the given move. The move is executed by using the doGenericMove method as a callback.
     */
    doBotMove() {

        let currentGamestate = this.sequence.getCurrentGamestate();
        PrologInterface.sendRequest(new PMsg_GetBotMove(currentGamestate, currentGamestate.getNextPlayerType(), this.doGenericMove.bind(this)));
    }

    /**
     * @method startAnimation
     * 
     * Change the orchestrator state to ON_Animation, disable picking and signal the auxiliary board to animate the given move by the given player.
     * The picking will be enabled once the animation is finished.
     * @param {number} player   
     * @param {Move} move 
     */
    startAnimation(player, move) {

        this.pickingEnabled = false;
        this.board.startAnimation(player, move);
        this.state = 'ON_ANIMATION';
    }

    /**
     * @method refreshGamestate
     * 
     * Refresh the gameboard to show the new pieces. This method can be called with an inMovie flag a true. If so the board will be filled with the current
     * movie gamestate and the movie will be stepped (see step movie).
     * @param {booean} inMovie  true if the game is in a showing movie state
     */
    refreshGamestate(inMovie) {

        if (inMovie) {
            let boardMatrix = this.sequence.getMovieGamestate().boardMatrix;
            this.board.fillBoards(boardMatrix['octagonBoard'], boardMatrix['squareBoard']);

            // Proceed to next move in movie
            this.stepMovie();
        }
        else {

            this.board.fillBoards(this.sequence.getCurrentGamestate().boardMatrix['octagonBoard'], this.sequence.getCurrentGamestate().boardMatrix['squareBoard']);
            this.state = 'DEFAULT';

            // Animation done, re-enable picking
            this.pickingEnabled = true;
        }
    }

    /**
     * @method stepMovie
     * 
     * Steps the sequence movie gamestate and starts the animation for the new step.
     */
    stepMovie() {

        let currentGamestate = this.sequence.getMovieGamestate();
        this.sequence.stepMovieGamestate();
        this.startAnimation(currentGamestate.nextPlayer, currentGamestate.nextMove);
    }

    /**
     * @method playMovie
     * 
     * Start playint the game movie. The game movie plays all the moves until the current game state.
     */
    playMovie() {

        // Signal the game sequence to start the movie.
        if (!this.sequence.startMovie())
            return;

        // Pause the game time counting
        this.overlay.timer.pause();

        // Disable picking
        this.pickingEnabled = false;

        // Go back to initial state
        this.resetBoard(this.sequence.getMovieGamestate());

        // Start the animation of the first movie
        this.stepMovie();
    }

    /**
     * @method undoMove
     * 
     * Undo the last move done in the game.
     */
    undoMove() {

        let previousGamestate = this.sequence.getPreviousGamestate();

        // Remove the last gamestate
        if (!this.sequence.undo())
            return;

        // If the game stops at a gameover, undoing a move always turns a gameover state into a non-gameover state
        this.gameover = false;

        // Remove the piece from the board
        this.refreshGamestate(false);

        // Rotate the camera to the next human player's position
        if(this.sequence.getCurrentGamestate().getNextPlayerType() == 'P'){

            this.currentTheme.rotateCamera(this.sequence.getCurrentGamestate().nextPlayer);
        }
        
        // Start the reverse animation of the removed piece (from the board to the correct auxiliary board).
        this.startAnimation(previousGamestate.nextPlayer, "undo");
    }

    /**
     * @method handleGameover
     * 
     * Handler for the prolog gameover checking message. 
     * @param {*} gameoverStatus false if a gameover didn't happen or the ID of the player who won
     */
    handleGameover(gameoverStatus) {

        // Update the scoreboard
        this.overlay.scoreboard.update();

        if (gameoverStatus == 'false')
            return;

        let winningPlayer = gameoverStatus;

        // Set the gameover flag to true
        this.gameover = true;

        // Stop counting time
        this.overlay.timer.pause();

        // Update the gameover overlay
        this.overlay.gameover_overlay.changeTexture(winningPlayer);
    }

    /**
     * @method update
     * 
     * Method used for updating elements acordding to time
     * @param {number} time 
     */
    update(time) { 

        if (!this.orchestratorReady)
            return;

        // Update the game themes (used for updating animations)
        this.themes.forEach(function(obj){obj.update(time)});

        var deltaT = time - this.lastT
        this.lastT = time;

        // Update the game overlay timer
        this.overlay.timer.update(time);

        if (this.state == 'ON_ANIMATION') {

            // If the game is in an animation state. Update the animations of the auxiliaryBoards
            this.board.auxBoards.update(deltaT);

            // If the animation has stopped
            if (!this.board.auxBoards.animationOnGoing()) {

                // Update the state of the board (the new piece can be added)
                this.refreshGamestate(this.sequence.inMovie)

                // If the next player is a human and we are not in the movie sequence, rotate the camera
                if(this.sequence.getCurrentGamestate().getNextPlayerType() == 'P' && !this.sequence.inMovie){

                    this.currentTheme.rotateCamera(this.sequence.getCurrentGamestate().nextPlayer);
                }
            }

            // Update the scoreboard
            this.overlay.scoreboard.update();
        }
        else if (this.sequence.getCurrentGamestate().getNextPlayerType() != 'P' && !this.botPlayRequested && !this.gameover && !this.inMenu) {

            // If the next player is a bot request a move from it (signalling prolog)
            this.botPlayRequested = true;
            this.doBotMove();
        }

        // Update the timer status
        if (this.overlay.timer.isPaused && !this.sequence.inMovie && !this.inMenu && !this.gameover)
            this.overlay.timer.start();

    }

    /**
     * @method display
     * 
     * Display the current theme.
     */
    display() {
        if (!this.orchestratorReady)
            return;

        this.currentTheme.display();

        // this.overlay.display();
    }
}