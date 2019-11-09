class Plane extends CGFobject {

    constructor(scene, nDivisionsU, nDivisionsV) {
        super(scene);

        this.nDivisionsU = nDivisionsU;
        this.nDivisionsV = nDivisionsV;
        this.initBuffers();
    }


    initBuffers() {


        let controlPoints = [
            // U = 0
            [ // V = 0..1;
                [-0.5,0,-0.5, 1],
                [-0.5,0.0, 0.5, 1]

            ],
            // U = 1
            [ // V = 0..1
                [0.5, 0.0, -0.5, 1],
                [0.5, 0.0, 0.5, 1]
            ]
        ];

        let nurbsSurface = new CGFnurbsSurface(1, 1, controlPoints);
        this.nurbsObject = new CGFnurbsObject(this.scene, this.nDivisionsU, this.nDivisionsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)

    }

    display(){

        this.nurbsObject.display();
    }

}