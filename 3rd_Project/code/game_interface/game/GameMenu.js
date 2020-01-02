class GameMenu {

    constructor(scene, orchestrator){

        this.scene = scene;
        this.orchestrator = orchestrator;
        this.graph = new MySceneGraph('menu.xml',scene,this,orchestrator);
    }

    initInterface() {
        let gui = this.scene.interface.gui;

        this.boardFolder = gui.addFolder('Board');
        this.boardFolder.add(this.orchestrator, 'boardHeight', 4, 14).name('Height').step(1);
        this.boardFolder.add(this.orchestrator, 'boardWidth', 4, 14).name('Width').step(1);
        this.boardFolder.open();

        this.playerFolder = gui.addFolder('Player');
        this.playerFolder.add(this.orchestrator, 'player1', {'Human': 'P', 'Computer Lv1': 1, 'Computer Lv2': 2}).name('Player 1');
        this.playerFolder.add(this.orchestrator, 'player2', {'Human': 'P', 'Computer Lv1': 1, 'Computer Lv2': 2}).name('Player 2');
        this.playerFolder.open();
    }

    destroyInterface() {
        let gui = this.scene.interface.gui;

        gui.removeFolder(this.boardFolder);
        gui.removeFolder(this.playerFolder);
    }

    update(time){
        var deltaT = time - this.lastT
        this.lastT = time;
        
        if (!this.sceneInited)
        return;
        
        if (!this.graph.loadedOk)
        return;
        
        if(!this.orchestrator.orchestratorReady)
        return;
        
        for (var key in this.graph.animations) {
            if (this.graph.animations[key].inUse){

                // console.log("updated " + key);
                this.graph.animations[key].update(deltaT);
            }
        }
    }


    /**
     * Initialize the defaukt camera
     */
    initDefaultCamera() {
        this.scene.camera = this.graph.cameras[this.graph.defaultCameraId];
        this.scene.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

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

    initMaterials(){

        this.materials = [];
        this.materials['special_p1_material'] = this.graph.materials['special_p1_material'];
        this.materials['special_p2_material'] = this.graph.materials['special_p2_material'];
        this.materials['special_square_tile_material'] = this.graph.materials['special_square_tile_material'];
        this.materials['special_octagonal_tile_material'] = this.graph.materials['special_octagonal_tile_material'];
        this.materials['special_main_board_material'] = this.graph.materials['special_main_board_material'];
        this.materials['special_aux_board_material'] = this.graph.materials['special_aux_board_material'];


        this.textures = [];
        this.textures['special_p1_tex']  = this.graph.textures['special_p1_tex'];
        this.textures['special_p2_tex']  = this.graph.textures['special_p2_tex'];
        this.textures['special_square_tile_tex']  = this.graph.textures['special_square_tile_tex'];
        this.textures['special_octagon_tile_tex']  = this.graph.textures['special_octagon_tile_tex'];
        this.textures['special_main_board_tex']  = this.graph.textures['special_main_board_tex'];
        this.textures['special_aux_board_tex']  = this.graph.textures['special_aux_board_tex'];
 
        this.playerMaterials = [];

        this.playerMaterials[0] = this.materials['special_p1_material'];
        this.playerMaterials[1] = this.materials['special_p2_material'];

        this.playerMaterials[0].setTexture(this.textures['special_p1_tex']);
        this.playerMaterials[1].setTexture(this.textures['special_p2_tex']);

        this.tileMaterials = [];

        this.tileMaterials[0] = this.materials['special_octagonal_tile_material'];
        this.tileMaterials[1] = this.materials['special_square_tile_material'];

        this.tileMaterials[0].setTexture(this.textures['special_square_tile_tex']);
        this.tileMaterials[1].setTexture(this.textures['special_octagon_tile_tex']);
        
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
        this.initDefaultCamera();
        this.initInterface();

        this.sceneInited = true;

        // this.orchestrator.init();
    }

    /**
     * Renders the graph scene.
     */
    display() {

        if (!this.sceneInited)
            return;

        this.scene.camera = this.graph.cameras[this.graph.defaultCameraId]; // TODO: change this
        this.scene.interface.setActiveCamera(this.scene.camera);

        // Scene rendering
        if (this.sceneInited) {

            // Displays the scene (MySceneGraph function).

            this.graph.displayScene();
            // this.button.display();
        }

    }

}