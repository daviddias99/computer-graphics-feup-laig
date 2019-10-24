/**
 * Class representing a torus
 */
class MyTorus extends CGFobject {
    /**
     * @constructor                 Torus constructor
     * @param {XMLscene} scene      Reference to the scene in which the torus will be displayed     
     * @param {Number} outerRadius  Outer radius
     * @param {Number} innerRadius  Inner radius
     * @param {Number} slices       Number of slices arround the inner radius
     * @param {Number} loops        Number of loops arround the circular axis
     */
    constructor(scene, outerRadius, innerRadius, slices, loops) {
        super(scene);

        this.outerRadius = outerRadius;
        this.innerRadius = innerRadius;
        this.slices = slices;
        this.loops = loops;

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

        // Angle arround the z axis
        var phi = 0;
        var deltaPhi = 2 * Math.PI / this.loops;
        // Angle arround the inner radius of the torus
        var deltaTheta = 2 * Math.PI / this.slices;

        // Texture coordinates
        var sCoord = 0;
        var deltaS = 1 / this.loops;
        var deltaT = 1 / this.slices;

        // Iterate through each loop
        for (var i = 0; i <= this.loops; i++) {
            var cosPhi = Math.cos(phi);
            var sinPhi = Math.sin(phi);
            
            var theta = 0;      
            var tCoord = 1;

            // Iterate through the vertices that make up each loop
            for (var j = 0; j <= this.slices; j++) {

                var cosTheta = Math.cos(theta);
                var sinTheta = Math.sin(theta);

                var vertex = [(this.outerRadius + this.innerRadius * cosTheta) * cosPhi
                                ,(this.outerRadius + this.innerRadius * cosTheta) * sinPhi
                                ,this.innerRadius * sinTheta]

                this.vertices.push(...vertex);
                
                var normal = [cosTheta * cosPhi, cosTheta * sinPhi, sinTheta];
                // Normalize the normal vector
                this.normals.push(...normalizeVector(normal));

                this.texCoords.push(sCoord, tCoord);
                
                tCoord -= deltaT;
                theta += deltaTheta;
                
                // On the last vertex no indices need to be pushed because the loop is already drawn
                if (j == this.slices)
                    break;
                
                // On the last loop no indices need to be pushed because the torus is fully drawn
                if (i == this.loops)
                    continue;

                // The index of the current vertex in the vertices array
                var index = i * (this.slices + 1) + j;
                this.indices.push(index, index + this.slices + 1, index + this.slices + 2);
                this.indices.push(index + this.slices + 2, index + 1, index);
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
	 * Updates the list of texture coordinates of the torus
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
	 * Updates the list of texture coordinates of the torus
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}