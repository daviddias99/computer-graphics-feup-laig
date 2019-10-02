

class MySceneComponent{

    constructor(id,scene,graph){

        this.id = id;
        this.scene = scene;
        this.graph = graph;
        this.children = [];
        this.transformation;
        this.materials =  [];
        this.inheritMaterial = false;
        this.useSelfTransf = false;
        this.currentMaterialIndex = 0;

    }


}