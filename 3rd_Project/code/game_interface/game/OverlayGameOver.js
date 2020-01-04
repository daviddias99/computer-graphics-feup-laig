class OverlayGameOver {

    constructor(scene) {
        this.scene = scene;

        this.textures = [
            new CGFtexture(scene, 'scenes/images/symbols/1.jpg'),
            new CGFtexture(scene, 'scenes/images/symbols/2.jpg')
        ];

        this.overlay = new GameOverlayElement(scene, [-0.1, 0.1, -0.1, 0.1], this.textures[0]);
    }

    changeTexture(player) {
        this.overlay.changeTexture(this.textures[player - 1]);
    }

    display() {
        this.scene.gl.disable(this.scene.gl.DEPTH_TEST);
        this.overlay.display();
        this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
    }
}