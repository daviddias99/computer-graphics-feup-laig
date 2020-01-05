
class MySceneComponent{

    constructor(id){

        this.id = id;                           // unique id of the component

        this.childrenComponents = [];           // child components
        this.childrenPrimitives = [];           // child primitives
        this.materials = [];                    // materials, each element is a CGFappearance object or the string 'inherit' in which case the components material is the parent one
        this.texture;                           // texture
        this.transformation;                    // transformation matrix
        this.textureBehaviour = 'defined';      // 'defined', 'inherit' or 'none'
        this.textureLengthS = 1;                // horizontal texture scale factor
        this.textureLengthT = 1;                // vertical texture scale factor
        this.currentMaterialIndex = 0;          // current material to be displayed
        this.loadedOk = false;                  // the component was correctly loaded
        this.animation;                         // animation
        this.pickable = false;                  // true if the object is pickable false otherwise
        this.pickID = null;                     // picking ID for the component
    }

    /**
     * Change the current active material for this component (if the current material is the last one in the array, the next one is the first)
     */
    cycleMaterials() {
        this.currentMaterialIndex++;
        
        if (this.currentMaterialIndex >= this.materials.length)
            this.currentMaterialIndex = 0;
    }
}