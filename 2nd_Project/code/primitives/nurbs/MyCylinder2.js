/**
 * Class reperesenting a cylinder
 */
class MyCylinder2 extends MyPrimitive {
    /**
     * @constructor                 Cylinder constructor
     * @param {XMLscene} scene      Reference to the scene in which the cylinder will be dispayed
     * @param {Number} baseRadius   Radius of the bottom base (z = 0)
     * @param {Number} topRadius    Radius of the top base (z = height)
     * @param {Number} height       Height of the cylinder
     * @param {Number} slices       Number of slices, rotation divisions
     * @param {Number} stacks       Nuber of stacks, height divisions
     */
    constructor(scene, baseRadius, topRadius, height, slices, stacks) {
        super(scene);   

        this.baseRadius = baseRadius;
        this.topRadius = topRadius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }


    initBuffers() {
            
    }
}