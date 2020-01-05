/**
 * Class that represents the timer overlay
 */
class OverlayTimer {

    /**
     * @constructor                     OverlayTimer constructor
     * @param {XMLscene} scene          Reference to the scene in which the timer will be displayed
     * @param {CGFtexture} textures     Array of textures for the digits and symbols 
     */
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

    /**
     * @method start
     * 
     * Start the timer
     */
    start() {
        this.isPaused = false;
    }

    /**
     * @method pause
     * 
     * Pause the timer
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * @method reset
     * 
     * Reset the timer to the starting state
     */
    reset() {
        this.isPaused = true;
        this.currentTime = 0;
        this.time = 0;

        this.timer[0].changeTexture(this.textures[0]);
        this.timer[1].changeTexture(this.textures[0]);
        this.timer[3].changeTexture(this.textures[0]);
        this.timer[4].changeTexture(this.textures[0]);
    }

    /**
     * @method update
     * @param {Number} time 
     * 
     * Update the timer
     */
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

    /**
     * @method display
     * 
     * Display the timer
     */
    display() {
        for (let i = 0; i < this.timer.length; i++)
            this.timer[i].display();
    }
}