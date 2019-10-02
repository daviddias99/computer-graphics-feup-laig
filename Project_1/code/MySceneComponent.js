

class MySceneComponent{

    constructor(id,scene,graph){

        this.id = id;
        this.scene = scene;
        this.graph = graph;

        this.childrenComponents = [];           // child components
        this.childrenPrimitives = [];           // child primitives
        this.materials =  [];                   // materials
        this.texture;                           // texture
        this.transformation;                    // transformation matrix (only defined if useSelfTransf = true)

        this.useSelfTransf = false;             // true if component uses a self-defined transformation

        this.materialBehaviour = 'defined';     // 'defined' or 'inherit'
        this.textureBehaviour = 'defined';      // 'defined', 'inherit' or 'none'
        this.textureLengthS = 0;
        this.textureLengthT = 0;

        this.currentMaterialIndex = 0;          // current material to be displayed

    }


}