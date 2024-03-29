/**
 * MyRectangle
 */
class MyRectangle extends CGFobject {
	/**
	 * @constructor				Rectangle constructor
	 * @param {XMLscene} scene 	Reference to the scene in which the rectangle will be displayed
	 * @param {String} id 		ID of the rectangle
	 * @param {Number} x1 		x coordinate for the left edge of the rectangle
	 * @param {Number} x2 		x coordinate for the right edge of the rectangle
	 * @param {Number} y1 		y coordinate for the bottom edge of the rectangle
	 * @param {Number} y2 		y coordinate for the top edge of the rectangle
	 */
	constructor(scene, id, x1, x2, y1, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.width = Math.abs(x2 - x1);
		this.height = Math.abs(y2 - y1);

		this.initBuffers();
	}
	
	/**
     * Initialize the vertices, indices, normals and texture coordinates of the rectangle
     */
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0		//3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		];

		this.defaultTexCoords = [...this.texCoords];
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method scaleTex
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Number} lengthS 	Number of tiles on the s axis
	 * @param {Number} lengthT 	Number of tiles on the t axis
	 */
	scaleTex(lengthS, lengthT) {
		for (var i = 0; i < this.texCoords.length; i++) {
			if (i % 2 == 0)	// length_s
				this.texCoords[i] *= this.width / lengthS;
			else			// length_t
				this.texCoords[i] *= this.height / lengthT;
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
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

