/**
 * Class that represents the gameover overlay message at the end of a game
 */
class OverlayGameOver {

    /**
     * @constructor             OverlayGameOver constructor
     * @param {XMLscene} scene  Reference to the scene in which the overlay will be displayed
     */
    constructor(scene) {
        this.scene = scene;

        this.textures = [
            new CGFtexture(scene, 'scenes/images/gameover/player_one_won.jpg'),
            new CGFtexture(scene, 'scenes/images/gameover/player_two_won.jpg')
        ];

        this.overlay = new GameOverlayElement(scene, [-0.5, 0.5, -0.1, 0.1], this.textures[0]);
    }

    /**
     * @method changeTexture
     * @param {Number} player 
     * 
     * Change texture according to the player to the who won
     */
    changeTexture(player) {
        this.overlay.changeTexture(this.textures[player - 1]);
    }

    /**
     * @method display
     * 
     * Display the game over message
     */
    display() {
        this.overlay.display();
    }
}