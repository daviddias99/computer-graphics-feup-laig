/**
 * Class that represents the scoreboard overlay
 */
class OverlayScoreboard {

    /**
     * @constructor             OverlayScoreboard constructor
     * @param {XMLscene} scene  Reference to the scene where the object will be displayed
     * @param {Array} textures  Array of textures for the scoreboard
     */
    constructor(scene, textures) {
        this.scene = scene;
        this.textures = textures;

        this.initBoard();
    }
    
    /**
     * @method initBoard
     * 
     * Initializes the scoreboard elements with textures
     */
    initBoard() {
        this.scores = [0, 0];
        this.players = [
            [
                new GameOverlayElement(this.scene, [-0.18, -0.14, -0.95, -0.85], this.textures[1]),
                new GameOverlayElement(this.scene, [-0.14, -0.10, -0.95, -0.85], this.textures['colon']),
                new GameOverlayElement(this.scene, [-0.10, -0.06, -0.95, -0.85], this.textures[0]),
                new GameOverlayElement(this.scene, [-0.06, -0.02, -0.95, -0.85], this.textures[0])
            ],
            [
                new GameOverlayElement(this.scene, [0.02, 0.06, -0.95, -0.85], this.textures[2]),
                new GameOverlayElement(this.scene, [0.06, 0.10, -0.95, -0.85], this.textures['colon']),
                new GameOverlayElement(this.scene, [0.10, 0.14, -0.95, -0.85], this.textures[0]),
                new GameOverlayElement(this.scene, [0.14, 0.18, -0.95, -0.85], this.textures[0])
            ]
        ];
        this.separator = new GameOverlayElement(this.scene, [-0.02, 0.02, -0.95, -0.85], this.textures['empty']);
    }

    /**
     * @method addBoard
     * @param {Board} board 
     * 
     * Change the board that the scoreboard is tracking
     */
    addBoard(board) {
        this.board = board;
        this.update();
    }
    
    /**
     * @method update
     * 
     * Updates the scores according to the board
     */
    update() {
        let scores = [0, 0];

        for (let i = 0; i < this.board.octagons.length; i++) {
            for (let j = 0; j < this.board.octagons[i].length; j++) {

                if (this.board.octagons[i][j].piece == null)
                    continue;

                (this.board.octagons[i][j].piece.player == 1) ? scores[0]++ : scores[1]++;
            }
        }

        for (let i = 0; i < this.scores.length; i++) {
            if (this.scores[i] == scores[i])
                continue;

            this.scores[i] = scores[i];

            this.players[i][2].changeTexture(this.textures[Math.floor(this.scores[i] / 10)]);
            this.players[i][3].changeTexture(this.textures[this.scores[i] % 10]);
        }
    }

    /**
     * @method display
     * 
     * Display the scoreboard
     */
    display() {
        this.separator.display();
        
        for (let i = 0; i < this.players.length; i++)
            for (let j = 0; j < this.players[i].length; j++)
                this.players[i][j].display();
    }
}