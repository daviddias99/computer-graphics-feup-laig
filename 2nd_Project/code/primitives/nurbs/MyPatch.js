class MyPatch extends MyPrimitive {

    constructor(scene, nDivisionsU, nDivisionsV, degreeU, degreeV,controlPoints) {
        super(scene);

        this.nDivisionsU = nDivisionsU;
        this.nDivisionsV = nDivisionsV;
        this.degreeU = degreeU;
        this.degreeV = degreeV;
        this.controlPoints = controlPoints;

        this.initBuffers();
    }


    initBuffers() {

        let nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.controlPoints);
        this.nurbsObject = new CGFnurbsObject(this.scene, this.nDivisionsU, this.nDivisionsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }

    display(){

        this.nurbsObject.display();
    }

}