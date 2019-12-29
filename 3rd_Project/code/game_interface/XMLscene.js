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

        // Variable initialization

        this.sceneInited = false;
        this.displayAxis = false;
        this.lastT = 0;

        // this.selectedCameraMain = "";

        this.cameraIDs = {};
        this.lightIDs = [];
        this.orchestrator = new GameOrchestrator(this);
        this.oldDisplayAxis = false;

        // PrologInterface.sendRequest(new PMsg_ApplyMove(this.gamestate, new Move(2,2)));
        // PrologInterface.sendRequest(new PMsg_GetValidMoves(this.gamestate));

    }



    /**
     * Update the animations and the shader according to the time.
     */
    update(t) {
        this.orchestrator.update(t);
    }

    
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }



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

        
        if(this.oldDisplayAxis != this.displayAxis){

            this.oldDisplayAxis = this.displayAxis;
            this.orchestrator.undo();
        }

        if (this.displayAxis)
            this.axis.display();

        this.orchestrator.handlePicking(this.pickResults);
        
        // Light update
        for (var i = 0; i < this.lights.length; i++)
            this.lights[i].update();

        this.orchestrator.display();

        this.popMatrix();

        this.pick_id = 1;
    }

}