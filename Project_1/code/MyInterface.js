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

        return true;
    }

    // TODO: comment this code
    addCameraDropdown() {

        this.gui.add(this.scene, 'selectedCamera', this.scene.cameraIDs).name('Selected view');
    }

    // TODO: comment this code
    addLightCheckboxes(){

        var lightsFolder = this.gui.addFolder('Lights');

        for(var i = 0; i < this.scene.lights.length; i++){

            if(this.scene.lightIDs[i]){
                lightsFolder.add(this.scene.lights[i], 'enabled').name(this.scene.lightIDs[i]);
            }

        }
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

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