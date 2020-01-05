/**
 * Class that represents all of the game's overlays
 */
class GameOverlay {

    /**
     * @constructor             GameOverlay constructor
     * @param {XMLscene} scene                  Reference to the scene in which the overlays will be displayed
     * @param {GameOrchestrator} orchestrator   Reference to the orchestrator
     */
    constructor(scene, orchestrator) {
        this.scene = scene;
        this.orchestrator = orchestrator;

        this.overlayShader = new CGFshader(scene.gl, 'shaders/overlay_shader.vert', 'shaders/overlay_shader.frag');

        this.initTextures();

        this.timer = new OverlayTimer(scene, this.textures);
        this.scoreboard = new OverlayScoreboard(scene, this.textures);
        this.gameover_overlay = new OverlayGameOver(scene);
    }

    /**
     * @method initTextures
     * 
     * Creates the textures common to the timer and scoreboard overlays
     */
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

    /**
     * @method display
     * 
     * Display the overlays
     */
    display() {
        if (this.orchestrator.inMenu)
            return;

        this.scene.setActiveShader(this.overlayShader);
        this.scene.gl.disable(this.scene.gl.DEPTH_TEST);

        this.timer.display();
        this.scoreboard.display();

        if (this.orchestrator.gameover)
            this.gameover_overlay.display();

        this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
        this.scene.setActiveShader(this.scene.defaultShader);
    }

}