/**
 * MyPatch represents a NURBS surface that is constructed from a given set of control points.
 */
class MyPatch extends MyPrimitive {

    /**
     * Build a new NURBS surface
     * @param {XMLScene} scene             
     * @param {Number} nDivisionsU      Number of divisions in U axis
     * @param {Number} nDivisionsV      Number of divisions in V axis 
     * @param {Number} degreeU          Degree on U axis 
     * @param {Number} degreeV          Degree on V axis 
     * @param {Array} controlPoints     Array of control points. Should be (degreeU + 1) * (degreeV + 1) in size 
     */
    constructor(scene, nDivisionsU, nDivisionsV, degreeU, degreeV,controlPoints) {
        super(scene);

        this.nDivisionsU = nDivisionsU;
        this.nDivisionsV = nDivisionsV;
        this.degreeU = degreeU;
        this.degreeV = degreeV;
        this.controlPoints = controlPoints;

        this.initBuffers();
    }

    /**
     * @method initBuffers
     * 
     * Initialize the needed objects
     */
    initBuffers() {

        let nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.controlPoints);
        this.nurbsObject = new CGFnurbsObject(this.scene, this.nDivisionsU, this.nDivisionsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }

    /**
     * @method display
     * 
     * Display the object
     */
    display(){

        this.nurbsObject.display();
    }

}