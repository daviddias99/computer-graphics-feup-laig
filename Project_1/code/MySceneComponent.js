
class MySceneComponent{

    constructor(id){

        this.id = id;

        this.childrenComponents = [];           // child components
        this.childrenPrimitives = [];           // child primitives
        this.materials =  [];                   // materials
        this.texture;                           // texture
        this.transformation;                    // transformation matrix
        this.materialBehaviour = 'defined';     // 'defined' or 'inherit'
        this.textureBehaviour = 'defined';      // 'defined', 'inherit' or 'none'
        this.textureLengthS = 0;
        this.textureLengthT = 0;

        this.currentMaterialIndex = 0;          // current material to be displayed

        this.loadedOk = false;                  // the component was correctly loaded

    }


}