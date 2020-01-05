class GameTheme {

    constructor(filename, scene, orchestrator) {
        this.scene = scene;
        this.orchestrator = orchestrator;
        this.graph = new MySceneGraph(filename, scene, this, orchestrator);
    }


    /**
     * Initialize the defaukt camera
     */
    initCameras() {
        let camera = this.graph.cameras[this.graph.defaultCameraId];
        this.scene.camera = new CGFcamera(camera.fov, camera.near, camera.far, camera.position, camera.target);
        this.cameraState = 'neutral';
        // TODO: remove this line
        this.scene.interface.setActiveCamera(this.scene.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
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

    initMaterials() {

        this.materials = [];

        for (let key in this.graph.materials) {

            if (key.substring(0, 7) == 'special') {
                this.materials[key] = this.graph.materials[key];
            }
        }

        this.textures = [];

        for (let key in this.graph.textures) {

            if (key.substring(0, 7) == 'special') {
                this.textures[key] = this.graph.textures[key];
            }
        }

        this.playerMaterials = [];

        this.playerMaterials[0] = this.materials['special_p1_material'];
        this.playerMaterials[1] = this.materials['special_p2_material'];

        this.playerMaterials[0].setTexture(this.textures['special_p1_tex']);
        this.playerMaterials[1].setTexture(this.textures['special_p2_tex']);

        this.tileMaterials = [];

        this.tileMaterials[0] = this.materials['special_octagonal_tile_material'];
        this.tileMaterials[1] = this.materials['special_square_tile_material'];

        this.tileMaterials[0].setTexture(this.textures['special_octagon_tile_tex']);
        this.tileMaterials[1].setTexture(this.textures['special_square_tile_tex']);

        this.boardMaterials = [];

        this.boardMaterials[0] = this.materials['special_main_board_material'];
        this.boardMaterials[1] = this.materials['special_aux_board_material'];

        this.boardMaterials[0].setTexture(this.textures['special_main_board_tex']);
        this.boardMaterials[1].setTexture(this.textures['special_aux_board_tex']);
    }


    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
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

    update(time) {

        var deltaT = time - this.lastT
        this.lastT = time;

        if (!this.sceneInited || !this.graph.loadedOk)
            return;

        for (var key in this.graph.animations) {

            if (this.graph.animations[key].inUse) {

                console.log(this.graph.animations);
                this.graph.animations[key].update(deltaT);
            }
        }

        if (this.rotating) {

            if (Math.abs(this.totalAngle) >= this.finalAngle) {

                this.rotating = false;
                this.orchestrator.pickingEnabled = true;
            }
            else {
                this.scene.camera.orbit(CGFaxis.Y, this.rotateSpeed);
                this.totalAngle += this.rotateSpeed;
            }

        }
    }

    rotateCamera(nextPlayer,immediate) {

        console.log("rotate called");
        if(this.cameraState == 'menu')
            return;

        this.changeToCamera(nextPlayer,immediate);
        
    }

    getOtherPlayer(player){

       return player == 1 ? 2 : 1;
    }

    getPlayerMod(player){

        return player == 1 ? 1 : -1;
    }

    changeToCamera(player,immediate){

        if(this.cameraState == player){
            this.orchestrator.pickingEnabled = true;
            return;
        }

        if (this.cameraState == 'neutral') {

            this.rotateSpeed = this.getPlayerMod(player) * Math.PI/2 / 50;
            this.finalAngle = Math.PI / 2;
        }
        else if (this.cameraState == this.getOtherPlayer(player)) {

            this.rotateSpeed = this.getPlayerMod(player) * Math.PI / 50;
            this.finalAngle = Math.PI;
        }

        this.cameraState = player;

        if(immediate){

            this.scene.camera.orbit(CGFaxis.Y,this.getPlayerMod(player) * this.finalAngle);
            return;
        }

        this.orchestrator.pickingEnabled = false;
        this.rotating = true;
        this.totalAngle = 0;

    }


    /**
     * Renders the graph scene.
     */
    display() {

        if (!this.sceneInited)
            return;

        // Scene rendering
        if (this.sceneInited) {

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

    }

}