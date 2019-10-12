/**
 * Class representing a triangle
 */
class MyTriangle extends CGFobject {
    /**
     * @constructor             Triangle constructor
     * @param {XMLscene} scene  Reference to the scene in which the triangle will be displayed
     * @param {Array} p1        Vertex 1
     * @param {Array} p2        Vertex 2
     * @param {Array} p3        Vertex 3
     */
    constructor(scene, p1, p2, p3) {
        super(scene);
        
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            this.p1[0], this.p1[1], this.p1[2],     // 0
            this.p2[0], this.p2[1], this.p2[2],     // 1
            this.p3[0], this.p3[1], this.p3[2]      // 2
        ];

        this.indices = [
            0, 1, 2
        ];
        
        // Create vectors used to compute the normal to the points of the triangle
        var vecA = subtractArrays(this.p1, this.p2);
        var vecB = subtractArrays(this.p1, this.p3);
        
        // The normal of the points of the triangle is obtained by the corss product of
        // the vectors of that form the plane where the triangle sits
        var normal = normalizeVector(crossProduct(vecA, vecB));
        
        // One normal for each vertex
        this.normals = [];
        this.normals.push(...normal, ...normal, ...normal);
        
        this.textureMapping();

        this.defaultTexCoords = [...this.texCoords];
        
        this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }

    /**
     * Method responsible for mapping the texture coordinates to the vertices of the triangle
     */
    textureMapping() {
        var b = distance(this.p1, this.p2);
        var c = distance(this.p2, this.p3);
        var a = distance(this.p3, this.p1);

        var cos = (a * a - b * b + c * c) / (2 * a * c);   
        var sin = Math.sqrt(1 - (cos * cos));

        this.texCoords = [
            c - a * cos, 1 - a * sin,
            0, 1,
            c, 1
        ];
    }

    /**
	 * @method scaleTex
	 * Updates the list of texture coordinates of the triangle
	 * @param {Number} lengthS 	Number of tiles on the s axis
	 * @param {Number} lengthT 	Number of tiles on the t axis
	 */
	scaleTex(lengthS, lengthT) {
		for (var i = 0; i < this.texCoords.length; i++) {
			if (i % 2 == 0)	
				this.texCoords[i] *= lengthS;
			else
				this.texCoords[i] *= lengthT;
		}
		this.updateTexCoordsGLBuffers();
	}

	/**
	 * @method resetTexCoords
	 * Resets the texture coordinates to the default values (0-1)
	 */
	resetTexCoords() {
		this.updateTexCoords(this.defaultTexCoords);
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the triangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}