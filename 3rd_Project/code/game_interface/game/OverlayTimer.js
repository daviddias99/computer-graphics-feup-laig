class OverlayTimer {

    constructor(scene) {
        this.scene = scene;

        this.initTextures();

        this.timer = [      // 10:10
            new GameOverlayElement(scene, [-0.10, -0.06, 0.85, 0.95], this.textures[0]),   // 0
            new GameOverlayElement(scene, [-0.06, -0.02, 0.85, 0.95], this.textures[0]),   // 1
            new GameOverlayElement(scene, [-0.02,  0.02, 0.85, 0.95], this.textures['colon']),   // :
            new GameOverlayElement(scene, [ 0.02,  0.06, 0.85, 0.95], this.textures[0]),   // 1
            new GameOverlayElement(scene, [ 0.06,  0.10, 0.85, 0.95], this.textures[0])    // 0
        ];

        this.time = 0;  
        this.lastTime = 0;
        this.isPaused = true;
        this.currentTime = 0;
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

    start() {
        this.isPaused = false;
    }

    pause() {
        this.isPaused = true;
    }

    reset() {
        this.isPaused = true;
        this.currentTime = 0;
        this.time = 0;

        this.timer[0].changeTexture(this.textures[0]);
        this.timer[1].changeTexture(this.textures[0]);
        this.timer[3].changeTexture(this.textures[0]);
        this.timer[4].changeTexture(this.textures[0]);
    }

    update(time) {
        let elapsedTime = time - this.lastTime;

        this.lastTime = time;

        if (this.isPaused) {
            return;
        }

        this.time += elapsedTime;

        if (Math.floor(this.time / 1000) == this.currentTime) {
            return;
        }
        this.currentTime = Math.floor(this.time / 1000);

        let currentMinutes = Math.floor(this.currentTime/60);
        let currentSeconds = Math.floor(this.currentTime % 60);

    
        this.timer[0].changeTexture(this.textures[Math.floor(currentMinutes / 10)]);
        this.timer[1].changeTexture(this.textures[currentMinutes % 10]);

        this.timer[3].changeTexture(this.textures[Math.floor(currentSeconds / 10)]);
        this.timer[4].changeTexture(this.textures[currentSeconds % 10]);
    }

    display() {
        for (let i = 0; i < this.timer.length; i++)
            this.timer[i].display();
    }
}