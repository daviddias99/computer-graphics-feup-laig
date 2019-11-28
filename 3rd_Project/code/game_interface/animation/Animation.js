/**
 * Class to represent a generic animation and it's core functionalitties
 */
class Animation {

    /** 
     * @constructor                 Animation constructor
     * @param {XMLscene} scene      Reference to the scene in which the animation will take place
     * @param {Number} id           Unique ID of the animation
     */
    constructor(scene,id) {
        this.id = id;
        this.scene = scene;
        this.transformationMatrix = mat4.create();  // Init the transf matrix as the identity matrix (no transformation)
        this.inUse = false;                         // inUse signals if the animation is currently being used.(used for performance as there is no need to update animations that are not in use)
    }
    
    /**
     * @method update
	 * Updates the animation transformation matrix according to the current time value
     * @param {Number} t    timeValue
     */
    update(t) { 
    }
    
    /**
     * @method apply
	 * Applies the animation to the scene
     */
    apply() {
        this.scene.multMatrix(this.transformationMatrix);
    }
}