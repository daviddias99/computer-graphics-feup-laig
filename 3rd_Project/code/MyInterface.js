/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();
        this.controlsFolder = this.gui.addFolder('Controls');
        this.controlsFolder.add(this.scene, 'displayAxis').name('Display Axis');


        return true;
    }

    /**
     * Add the camera-selection dropdown to the interface of the scene
     */
    addCameraDropdown() {

        this.controlsFolder.add(this.scene, 'selectedCameraMain', this.scene.cameraIDs).name('Selected view');
        this.controlsFolder.add(this.scene, 'selectedCameraSecurity', this.scene.cameraIDs).name('Security');
    }

    /**
     * Add the checkboxes that control the status of each light(on/off). The checkboxes are created under a folder called 'Lights'
     */
    addLightCheckboxes(){

        var lightsFolder = this.controlsFolder.addFolder('Lights');

        for(var i = 0; i < this.scene.lights.length; i++){

            if(this.scene.lightIDs[i]){
                lightsFolder.add(this.scene.lights[i], 'enabled').name(this.scene.lightIDs[i]);
            }

        }
    }

    /**
     * Initialize key listening
     */
    initKeys() {
        this.scene.gui = this;
        this.activeKeys = {};
    }
    
    /**
     * Applies the material cycling when the 'M' or 'm' key is pressed
     * @param {keyboard event} event 
     */
    processKeyboard(event) {
        if(event.code=="KeyM"){
            this.scene.graph.cycleMaterials();
        }
    };

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;    
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}