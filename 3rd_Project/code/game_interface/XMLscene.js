var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;

    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.camera = new CGFcamera(30, 10, 20, [0,0,0], [0,1,0]);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(20);

        // // TODO: remove from here
        // this.sqr = new CGFappearance(this);
        // this.sqr.setAmbient(0.0, 0.1, 0.0, 1);
        // this.sqr.setDiffuse(0.0, 0.9, 0.0, 1);
        // this.sqr.setSpecular(0.0, 0.1, 0.0, 1);
        // this.sqr.setShininess(10.0);

        // this.oct = new CGFappearance(this);
        // this.oct.setAmbient(0.1, 0.0, 0.0, 1);
        // this.oct.setDiffuse(0.9, 0.0, 0.0, 1);
        // this.oct.setSpecular(0.1, 0.0, 0.0, 1);
        // this.oct.setShininess(10.0);


        // let oct_radius = 0.2;
        // let sqr_radius = Math.sqrt(Math.pow(oct_radius * Math.sin(Math.PI / 8.0) * 2.0, 2) / 2.0);

        // let primitives = [
        //     new TilePrimitive(this, oct_radius, 8, this.oct),          // octogonal tile
        //     new PiecePrimitive(this, oct_radius, 8, 0.05, this.oct),   // octogonal piece
        //     new TilePrimitive(this, sqr_radius, 4, this.sqr),          // square tile
        //     new PiecePrimitive(this, sqr_radius, 4, 0.05, this.sqr)    // square piece
        // ];

        // this.board = new Board(this, primitives, 4, 3);
        // // to here

        // Variable initialization

        this.sceneInited = false;
        this.displayAxis = false;
        this.lastT = 0;

        this.selectedCameraMain = "";

        this.cameraIDs = {};
        this.lightIDs = [];

        this.gamestate = new GameState(this.board,'P',1,1,'1-0');

        this.orchestrator = new GameOrchestrator(this);

        // PrologInterface.sendRequest(new PMsg_ApplyMove(this.gamestate, new Move(2,2)));
        // PrologInterface.sendRequest(new PMsg_GetValidMoves(this.gamestate));

    }



    /**
     * Update the animations and the shader according to the time.
     */
    update(t) {

        var deltaT = t - this.lastT
        this.lastT = t;

        // if (!this.graph.loadedOk)
        //     return;

        // for (var key in this.graph.animations) {

        //     if (this.graph.animations[key].inUse)
        //         this.graph.animations[key].update(deltaT);
        // }
    }

    // changeSceneGraph(newSceneGraph){

    //     this.sceneInited = true;

    //     this.graph = newSceneGraph;

    //     this.axis = new CGFaxis(this, this.graph.referenceLength);

    //     this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

    //     this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
    //     this.initLights();
    //     this.initDefaultCamera();

    //     // this.activateCameraSelectionDropdown();
    //     // this.activateLightSelectionCheckboxes();

    //     this.sceneInited = true;
    // }



    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    // /**
    //  * Initialize the defaukt camera
    //  */
    // initDefaultCamera() {
    //     this.camera = this.graph.cameras[this.graph.defaultCameraId];
    //     this.interface.setActiveCamera(this.camera);
    // }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    // initLights() {
    //     var i = 0;
    //     // Lights index.

    //     // Reads the lights from the scene graph.
    //     for (var key in this.graph.lights) {
    //         if (i >= 8)
    //             break;              // Only eight lights allowed by WebGL.

    //         if (this.graph.lights.hasOwnProperty(key)) {
    //             var light = this.graph.lights[key];

    //             this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
    //             this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
    //             this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
    //             this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

    //             this.lights[i].setConstantAttenuation(light[6][0]);
    //             this.lights[i].setLinearAttenuation(light[6][1]);
    //             this.lights[i].setQuadraticAttenuation(light[6][2]);

    //             if (light[1] == "spot") {
    //                 this.lights[i].setSpotCutOff(light[7]);
    //                 this.lights[i].setSpotExponent(light[8]);
    //                 this.lights[i].setSpotDirection(light[9][0] - light[2][0], light[9][1] - light[2][1], light[9][2] - light[2][2]);
    //             }

    //             if (light[0])
    //                 this.lights[i].enable();
    //             else
    //                 this.lights[i].disable();

    //             this.lights[i].update();
    //             this.lightIDs[i] = key;
    //             i++;

    //         }
    //     }
    // }



    /**
     * Set the camera to the default one and add the camera selection section of the interface.
     */
    activateCameraSelectionDropdown() {

        for (var key in this.graph.cameras) {

            this.cameraIDs[key] = key;
        }
        this.selectedCameraMain = this.graph.defaultCameraId;
        this.interface.addCameraDropdown();
    }

    /**
     * Add the light-control section of the interface
     */
    activateLightSelectionCheckboxes() {
        this.interface.addLightCheckboxes();
    }

    // /** Handler called when the graph is finally loaded. 
    //  * As loading is asynchronous, this may be called already after the application has started the run loop
    //  */
    // onGraphLoaded() {
    //     this.axis = new CGFaxis(this, this.graph.referenceLength);

    //     this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

    //     this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
    //     this.initLights();
    //     this.initDefaultCamera();

    //     this.activateCameraSelectionDropdown();
    //     this.activateLightSelectionCheckboxes();

    //     this.sceneInited = true;
    // }

    logPicking() {
		if (this.pickMode == false) {
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i = 0; i < this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj) {
						var customId = this.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                        console.log(obj.getBoardPosition());						
					}
				}
				this.pickResults.splice(0, this.pickResults.length);
			}
		}
	}

    /**
     * Renders the graph scene.
     */
    display() {

        this.pick_id = 1;
        
        // ---- BEGIN Background, camera and axis setup
        
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        // ---- END Background, camera and axis setup

        this.pushMatrix();

        if (this.displayAxis)
            this.axis.display();


        this.logPicking();
        
        // Light update
        for (var i = 0; i < this.lights.length; i++)
            this.lights[i].update();

        this.orchestrator.display();

        this.popMatrix();

        this.pick_id = 1;
    }

}