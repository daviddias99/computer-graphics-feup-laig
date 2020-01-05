class OverlayTimer {

    constructor(scene, textures) {
        this.scene = scene;
        this.textures = textures;

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
        // this.scene.gl.disable(this.scene.gl.DEPTH_TEST);

        for (let i = 0; i < this.timer.length; i++)
            this.timer[i].display();

        // this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
    }
}