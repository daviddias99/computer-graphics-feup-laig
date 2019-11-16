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
        this.lastT = 0;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(10);

        this.selectedCameraMain = "";
        this.selectedCameraSecurity = "";

        this.cameraIDs = {};
        this.lightIDs = [];
        this.displayAxis = false;

        this.cameraTex = new CGFtextureRTT(this,this.gl.canvas.width,this.gl.canvas.height);
        this.cameraTex.bind(0);

        this.cameraScreenShader = new CGFshader(this.gl, "shaders/camera_shader.vert", "shaders/camera_shader.frag");
        this.sec_camera = new MySecurityCamera(this,this.gl.canvas.width,this.gl.canvas.height);
        
        this.OtherFactor = 1.0;
        this.nStripes  = 10.0 ;
        this.nRepitition = 2.0;

    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    initDefaultCamera() {
        this.camera = this.graph.cameras[this.graph.defaultCameraId];
        this.interface.setActiveCamera(this.camera);
    }

    // TODO: remove this
    // onScaleFactorChanged(v) {
    //     console.log("called");
	// 	this.cameraScreenShader.setUniformsValues({ OtherFactor: this.OtherFactor, nStripes: this.nStripes, nRepitition: this.nRepitition });
	// }


    update(t){

        var deltaT = t - this.lastT
        this.lastT = t;

        this.cameraScreenShader.setUniformsValues({ timefactor: t /5000 % 10 });

        if(!this.graph.loadedOk)
            return;

        for(var key in this.graph.animations){

            if(this.graph.animations[key].inUse)
                this.graph.animations[key].update(deltaT);
        }
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

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0] - light[2][0], light[9][1] - light[2][1], light[9][2] - light[2][2]);
                }

                // this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();
                this.lightIDs[i] = key;
                i++;

            }
        }
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
        this.selectedCameraSecurity= this.graph.defaultCameraId;
        this.interface.addCameraDropdown();
    }

    /**
     * Add the light-control section of the interface
     */
    activateLightSelectionCheckboxes(){
        this.interface.addLightCheckboxes();
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.initDefaultCamera();

        this.activateCameraSelectionDropdown();
        this.activateLightSelectionCheckboxes();

        this.sceneInited = true;
    }

    /**
     * Renders the scene.
     */
    render() {
        this.camera = this.selectedCamera;
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        
        if(this.displayAxis)
            this.axis.display();

        // ---- END Background, camera and axis setup

        // Light update
        for (var i = 0; i < this.lights.length; i++)
            this.lights[i].update();


        // Scene drawing
        if (this.sceneInited) {

            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();

    }

    display(){

        if(!this.sceneInited)
            return;

        this.selectedCamera = this.graph.cameras[this.selectedCameraSecurity];

        this.cameraTex.attachToFrameBuffer();
        this.render();
        this.cameraTex.detachFromFrameBuffer();

        this.selectedCamera =this.graph.cameras[this.selectedCameraMain];
        this.interface.setActiveCamera(this.selectedCamera);
        this.render();
        
        this.setActiveShader(this.cameraScreenShader); 
        this.gl.disable(this.gl.DEPTH_TEST);
        this.cameraTex.bind(0);

        this.sec_camera.display();

        this.gl.enable(this.gl.DEPTH_TEST);
        this.setActiveShader(this.defaultShader); 

    }
}