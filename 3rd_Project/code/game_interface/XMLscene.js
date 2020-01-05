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

        this.setUpdatePeriod(20);

        // Variable initialization

        this.sceneInited = false;

        this.cameraIDs = {};
        this.lightIDs = [];
        this.orchestrator = new GameOrchestrator(this);
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
     * Log object picking. Used for debugging purposes
     */
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
        
        // ---- BEGIN Background, camera setup
        
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        // ---- END Background, camera  setup

        this.pushMatrix();

        // Process picking
        this.orchestrator.processPickingResults(this.pickResults);
        this.pick_id = 1;
        
        // Update scene lights
        for (var i = 0; i < this.lights.length; i++)
            this.lights[i].update();

        // Display game
        this.orchestrator.display();


        this.popMatrix();

        
    }

}