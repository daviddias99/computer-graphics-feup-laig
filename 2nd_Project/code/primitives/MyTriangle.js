/**
 * Class representing a triangle
 */
class MyTriangle extends MyPrimitive {
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

    /**
     * Initialize the vertices, indices, normals and texture coordinates of the triangle
     */
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
        this.a = distance(this.p1, this.p2);
        this.b = distance(this.p2, this.p3);
        this.c = distance(this.p3, this.p1);

        this.cos = (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2 * this.a * this.c);   
        this.sin = Math.sqrt(1 - Math.pow(this.cos, 2));
        
        /*  +---> s
            |
		    v
            t       */
        
        this.texCoords = [
            0, 0,
            this.a, 0,
            this.c * this.cos, this.c * this.sin
        ];
    }

    /**
	 * @method scaleTex
	 * Updates the list of texture coordinates of the triangle
	 * @param {Number} lengthS 	Number of tiles on the s axis
	 * @param {Number} lengthT 	Number of tiles on the t axis
	 */
	scaleTex(lengthS, lengthT) {
		this.texCoords = [
            0, 0,
            this.a / lengthS, 0,
            this.c * this.cos / lengthS, this.c * this.sin / lengthT
        ];
        
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