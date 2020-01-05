/**
 * Class representing a theme of the game. It it's defined through a xml.
 */
class GameTheme {

    constructor(filename, scene, orchestrator) {
        this.scene = scene;
        this.orchestrator = orchestrator;
        this.graph = new MySceneGraph(filename, scene, this, orchestrator);
    }

    /**
     * @method initCameras
     * 
     * Init the camera of the game. A game theme only has one camera, that must be put in the neutral side of the board with playerOne to it's right and player two to it's left.
     * This camera is the default camera of the xml. The camera has three states: neutral, menu, 1 and 2.
     */
    initCameras() {
        let camera = this.graph.cameras[this.graph.defaultCameraId];
        this.scene.camera = new CGFcamera(camera.fov, camera.near, camera.far, camera.position, camera.target);
        this.cameraState = 'neutral';
        // TODO: remove this line
        this.scene.interface.setActiveCamera(this.scene.camera);
    }

    /**
     * @method initLights
     * 
     * Initialize the lights of the scene according to the lights read from the xml.
     */
    initLights() {
        let i = 0;

        for (let j = 0; j < this.scene.lights.length; j++)
            this.scene.lights[j] = new CGFlight(this.scene, j);

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                let light = this.graph.lights[key];

                this.scene.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.scene.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.scene.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.scene.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                this.scene.lights[i].setConstantAttenuation(light[6][0]);
                this.scene.lights[i].setLinearAttenuation(light[6][1]);
                this.scene.lights[i].setQuadraticAttenuation(light[6][2]);

                if (light[1] == "spot") {
                    this.scene.lights[i].setSpotCutOff(light[7]);
                    this.scene.lights[i].setSpotExponent(light[8]);
                    this.scene.lights[i].setSpotDirection(light[9][0] - light[2][0], light[9][1] - light[2][1], light[9][2] - light[2][2]);
                }

                if (light[0])
                    this.scene.lights[i].enable();
                else
                    this.scene.lights[i].disable();

                this.scene.lights[i].update();
                this.scene.lightIDs[i] = key;
                i++;

            }
        }
    }

    /**
     * @method initMaterials
     * 
     * Initialize the materials/textures of the game. The game has materials/textures for the tiles of the board, main board and aux board materials and the pieces
     */
    initMaterials() {


        // Fetch materials and textures form graph

        let materials = {};

        for (let key in this.graph.materials) {

            if (key.substring(0, 7) == 'special') {
                materials[key] = this.graph.materials[key];
            }
        }

        let textures = {};

        for (let key in this.graph.textures) {

            if (key.substring(0, 7) == 'special') {
                textures[key] = this.graph.textures[key];
            }
        }

        // Put player materials in an array

        this.playerMaterials = [];

        this.playerMaterials[0] = materials['special_p1_material'];
        this.playerMaterials[1] = materials['special_p2_material'];

        this.playerMaterials[0].setTexture(textures['special_p1_tex']);
        this.playerMaterials[1].setTexture(textures['special_p2_tex']);

        // Put tile materials in an array

        this.tileMaterials = [];

        this.tileMaterials[0] = materials['special_octagonal_tile_material'];
        this.tileMaterials[1] = materials['special_square_tile_material'];

        this.tileMaterials[0].setTexture(textures['special_octagon_tile_tex']);
        this.tileMaterials[1].setTexture(textures['special_square_tile_tex']);

        // Put board materials in an array

        this.boardMaterials = [];

        this.boardMaterials[0] = materials['special_main_board_material'];
        this.boardMaterials[1] = materials['special_aux_board_material'];

        this.boardMaterials[0].setTexture(textures['special_main_board_tex']);
        this.boardMaterials[1].setTexture(textures['special_aux_board_tex']);
    }


    /** 
     * @method onGraphLoaded
     * 
     * Change the scene to display the scene defined in the theme's graph
     */
    onGraphLoaded() {
        this.scene.axis = new CGFaxis(this.scene, this.graph.referenceLength);
        this.scene.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
        this.scene.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
        this.initMaterials();
        this.initLights();
        this.initCameras();
        this.sceneInited = true;
    }

    /**
     * @method update
     * 
     * Updates elements of the theme such as the xml-configured object animations and the animations of the camera
     * @param {Integer} time 
     */
    update(time) {

        var deltaT = time - this.lastT
        this.lastT = time;

        if (!this.sceneInited || !this.graph.loadedOk)
            return;

        // update the graphs animations
        for (var key in this.graph.animations) {

            if (this.graph.animations[key].inUse) {
                this.graph.animations[key].update(deltaT);
            }
        }

        // update camera rotation
        this.updateCameraRotation();
    }

    /**
     * @method updateCameraRotation
     * 
     * Updates the rotating animation of the camera. When the animation is over it re-enables the scene picking
     */
    updateCameraRotation() {

        if (!this.rotating)
            return;

        // Animation is over?
        if (Math.abs(this.totalAngle) >= this.finalAngle) {

            // Stop rotating and re-enable picking
            this.rotating = false;
            this.orchestrator.pickingEnabled = true;
        }
        else {

            // Rotate the camera
            this.scene.camera.orbit(CGFaxis.Y, this.rotateSpeed);
            this.totalAngle += this.rotateSpeed;
        }

    }

    /**
     * @method rotateCamera
     * 
     * Rotate the camera to the "player"'s position. The rotation can be immediate or with an animation
     * 
     * @param {Integer} player              '1' or '2' refering to the destination of the camera rotation
     * @param {Boolean} immediate            true if no animation is required
     */
    rotateCamera(player, immediate) {


        // Check if the game is in a menu state. There is no rotation of the camera in the menu state or if the camera is already in the player's state, in which no rotation is needed
        if (this.cameraState == 'menu' || this.cameraState == player)
            return;

        const ANG_90_DEGREE = Math.PI / 2
        const ROTATION_SPEED = 30;

        // Rotations from neutral position are 90 degrees and from a player position are 180 degrees
        if (this.cameraState == 'neutral') {

            this.rotateSpeed = this.getPlayerMod(player) * ANG_90_DEGREE / ROTATION_SPEED;
            this.finalAngle = ANG_90_DEGREE;
        }
        else if (this.cameraState == this.getOtherPlayer(player)) {

            this.rotateSpeed = this.getPlayerMod(player) * ANG_90_DEGREE * 2 / ROTATION_SPEED;
            this.finalAngle = ANG_90_DEGREE * 2;
        }

        this.cameraState = player;

        // If the rotation is immediate there is no need to set the camera rotat
        if (immediate) {

            this.scene.camera.orbit(CGFaxis.Y, this.getPlayerMod(player) * this.finalAngle);
            return;
        }

        // No picking is allowed during the rotation
        this.orchestrator.pickingEnabled = false;

        // Start the animation
        this.rotating = true;
        this.totalAngle = 0;

    }

    getOtherPlayer(player) {

        return player == 1 ? 2 : 1;
    }

    getPlayerMod(player) {

        return player == 1 ? 1 : -1;
    }

    /**
     * @method display
     * 
     * Display the scene graph.
     */
    display() {

        if (!this.sceneInited)
            return;

        // Displays the scene (MySceneGraph function).
        this.graph.displayScene();


    }

}