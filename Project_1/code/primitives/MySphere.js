
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

    /**
     * Initialize the vertices, indices, normals and texture coordinates of the sphere
     */
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
        var tCoord = 1;
        var deltaS = 1 / this.slices;
        var deltaT = 1 /trueStacks;


        // Iterate through all the points on the same line that goes from pole to pole
        for (var i = 0; i <= this.slices; i++) {

            var cosPhi = Math.cos(phi);
            var sinPhi = Math.sin(phi);
            var theta = -Math.PI/2;
            tCoord = 1;
            
            // Iterate through all the points on the same edge
            for (var j = 0; j <= trueStacks; j++) {

                var cosTheta = Math.cos(theta);
                var sinTheta = Math.sin(theta);

                var vertex = [this.radius * cosTheta * cosPhi
                            , this.radius * cosTheta * sinPhi
                            , this.radius * sinTheta];

                // Add the apropriate vertex normals and texture coordinates
                // The normal to a point on the sphere can be the vector that links the
                // center of the sphere with that point (normalized). Since the center of
                // the sphere is (0,0,0) the normal is equal to the vertex position (normalized)
                this.vertices.push(...vertex);
                this.normals.push(...normalizeVector(vertex));
                this.texCoords.push(sCoord, tCoord);

                theta += deltaTheta;
                tCoord -= deltaT;

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
                this.indices.push(index, index + trueStacks + 1,index + trueStacks + 2);
                this.indices.push(index,index + trueStacks + 2,index + 1);

            }

            phi += deltaPhi;
            sCoord += deltaS;
        }

        this.defaultTexCoords = [...this.texCoords];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
	 * @method scaleTex
	 * Updates the list of texture coordinates of the sphere. Unused in the sphere
	 * @param {Number} lengthS 	Number of tiles on the s axis
	 * @param {Number} lengthT 	Number of tiles on the t axis
	 */
	scaleTex(lengthS, lengthT) {}

	/**
	 * @method resetTexCoords
	 * Resets the texture coordinates to the default values (0-1)
	 */
	resetTexCoords() {
		this.updateTexCoords(this.defaultTexCoords);
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the sphere
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}