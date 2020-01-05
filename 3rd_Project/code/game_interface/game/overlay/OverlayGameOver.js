class OverlayGameOver {

    constructor(scene) {
        this.scene = scene;

        this.textures = [
            new CGFtexture(scene, 'scenes/images/gameover/player_one_won.jpg'),
            new CGFtexture(scene, 'scenes/images/gameover/player_two_won.jpg')
        ];

        this.overlay = new GameOverlayElement(scene, [-0.5, 0.5, -0.1, 0.1], this.textures[0]);
    }

    changeTexture(player) {
        this.overlay.changeTexture(this.textures[player - 1]);
    }

    display() {
        this.overlay.display();
    }
}