class OverlayScoreboard {

    constructor(scene) {
        this.scene = scene;

        this.initTextures();

    }

    initTextures() {
        this.textures = [
            new CGFtexture(this.scene, 'scenes/images/symbols/0.jpg'),
            new CGFtexture(this.scene, 'scenes/images/symbols/1.jpg'),
            new CGFtexture(this.scene, 'scenes/images/symbols/2.jpg'),
            new CGFtexture(this.scene, 'scenes/images/symbols/3.jpg'),
            new CGFtexture(this.scene, 'scenes/images/symbols/4.jpg'),
            new CGFtexture(this.scene, 'scenes/images/symbols/5.jpg'),
            new CGFtexture(this.scene, 'scenes/images/symbols/6.jpg'),
            new CGFtexture(this.scene, 'scenes/images/symbols/7.jpg'),
            new CGFtexture(this.scene, 'scenes/images/symbols/8.jpg'),
            new CGFtexture(this.scene, 'scenes/images/symbols/9.jpg')
        ];
        this.textures['colon'] = new CGFtexture(this.scene, 'scenes/images/symbols/colon.jpg');
        this.textures['empty'] = new CGFtexture(this.scene, 'scenes/images/symbols/empty.jpg');
    }
}