class Animation {

    constructor(scene,id) {
        this.id = id;
        this.scene = scene;
        this.transformationMatrix = mat4.create();
        this.inUse = false; 
    }
    
    update(t) {
        
    }
    
    apply() {

        this.scene.multMatrix(this.transformationMatrix);
    }
}