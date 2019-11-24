/**
 * MyPlane is a class that represents a plane through NURBS. It is equivalent to a Patch with U and V degree of 1
 */
class MyPlane extends MyPrimitive {

    /**
     * @constructor
     * @param {XMLScene} scene 
     * @param {Number} nDivisionsU  Number of divisions on the U Axis
     * @param {Number} nDivisionsV  Number of divisions on the V Axis
     */
    constructor(scene, nDivisionsU, nDivisionsV) {
        super(scene);

        this.nDivisionsU = nDivisionsU;
        this.nDivisionsV = nDivisionsV;
        this.initBuffers();
    }


    /**
     * @method initBuffers
     * 
     * Create the array of control points and init the NURBS object/surface.
     */
    initBuffers() {


        let controlPoints = [
            // U = 0
            [ // V = 0..1;
                [-0.5,0,-0.5, 1],
                [0.5,0.0, -0.5, 1]

            ],
            // U = 1
            [ // V = 0..1
                [-0.5, 0.0, 0.5, 1],
                [0.5, 0.0, 0.5, 1]
            ]
        ];

        let nurbsSurface = new CGFnurbsSurface(1, 1, controlPoints);
        this.nurbsObject = new CGFnurbsObject(this.scene, this.nDivisionsU, this.nDivisionsV, nurbsSurface); 

    }

    /**
     * @method display
     * 
     * Display the scene
     */
    display(){

        this.nurbsObject.display();
    }

}