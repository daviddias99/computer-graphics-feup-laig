
/**
 * Class representing a sphere
 */
class MySphere extends CGFobject {

    /**
     * @constructor             Sphere constructor
     * @param {XMLscene} scene  Reference to the scene in which the cylinder will be dispayed
     * @param {Number} radius   Radius of the sphere
     * @param {Number} slices   Number of slices, rotation divisions
     * @param {Number} stacks   Nuber of stacks, height divisions of half the sphere
     */
    constructor(scene, radius, slices, stacks) {
        super(scene);

        this.radius = radius;
        this.stacks = stacks;
        this.slices = slices;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var trueStacks = 2 * this.stacks;
        var phi = 0;
        var deltaPhi = 2 * Math.PI / this.slices;
        var deltaTheta = Math.PI / trueStacks;

        var sCoord = 0;
        var deltaS = 1 / this.slices;
        var deltaT = 1 / this.stacks;


        // Iterate through all the points on the same line that goes from pole to pole
        for (var i = 0; i <= this.slices; i++) {

            var cosPhi = Math.cos(phi);
            var sinPhi = Math.sin(phi);
            var theta = 0
            
            // Iterate through all the points on the same edge
            for (var j = 0; j <= trueStacks; j++) {

                var cosTheta = Math.cos(theta);
                var sinTheta = Math.sin(theta);

                // Calculate the vertex coordinates
                var vertex = [this.radius * sinTheta * cosPhi
                            ,this.radius * sinPhi * sinTheta
                            ,this.radius * cosTheta];

                // Add the apropriate vertex normals and texture coordinates
                // The normal to a point on the sphere can be the vector that links the
                // center of the sphere with that point (normalized). Since the center of
                // the sphere is (0,0,0) the normal is equal to the vertex position (normalized)
                this.vertices.push(...vertex);
                this.normals.push(...normalizeVector(vertex));
                this.texCoords.push(sCoord, 1 - deltaT * j);

                theta += deltaTheta;

                /* On the last iteration of this cycle we only need to add the vertices, 
                the normals and the texture coordinates to the corresponding arrays because 
                we always push the indeces for the triangles that make up the square above 
                the point*/
                if (j == trueStacks)
                    continue;

                /* If we are iterating through the points of the last edge we only need to add the vertices, 
                the normals and the texture coordinates to the corresponding arrays because these points 
                overlap with the first ones */
                if (i == this.slices)
                    continue;

                // This is the index of the current vertix in the vertices array
                var index = i * (trueStacks + 1) + j;
                this.indices.push(index + trueStacks + 2, index + trueStacks + 1,index);
                this.indices.push(index,index + 1,index + trueStacks + 2);

            }

            phi += deltaPhi;
            sCoord += deltaS;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}