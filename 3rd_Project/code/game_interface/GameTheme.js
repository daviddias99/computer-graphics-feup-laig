class GameTheme {

    constructor(filename, scene){

        var filename=getUrlVars()['file'] || "test_scenes/board.xml";
        this.scene = scene;
        this.graph = new MySceneGraph(filename,scene,this);
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

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.scene.axis = new CGFaxis(this.scene, this.graph.referenceLength);
        this.scene.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
        this.scene.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
        
        this.initLights();
        this.initDefaultCamera();

        // this.activateCameraSelectionDropdown();
        // this.activateLightSelectionCheckboxes();

        this.sceneInited = true;
    }

    update(time){
        var deltaT = time - this.lastT
        this.lastT = time;

        if (!this.graph.loadedOk)
            return;

        for (var key in this.graph.animations) {

            if (this.graph.animations[key].inUse)
                this.graph.animations[key].update(deltaT);
        }
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
        }

    }

}