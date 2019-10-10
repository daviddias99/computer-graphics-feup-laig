// FIXME: for some reason if the number of slices or stacks is over 254 there is a gap on the cylinder side

/**
 * Class reperesenting a cylinder
 */
class MyCylinder extends CGFobject {
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
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var deltaAngle = 2 * Math.PI / this.slices;

        var deltaHeight = this.height / this.stacks;
        
        var radius = this.baseRadius;
        var deltaRadius = (this.topRadius - this.baseRadius) / this.stacks;

        var sCoord = 0;
        var deltaS = 1 / this.slices;
        var deltaT = 1 / this.stacks;

        // Iterate through all the edges
        for (var i = 0; i <= this.slices; i++) {

            var ca = Math.cos(ang);
            var sa = Math.sin(ang);
            
            // The normal vector for all the points on the same edge is the same
            var normal = [ca, -sa, (this.baseRadius - this.topRadius) / this.height];
            // Normalization of the normal vector
            normal = normalizeVector(normal);

            // Iterate through all the points on the same edge
            for (var j = 0; j <= this.stacks; j++) {
                
                this.vertices.push(ca * (radius + (j + 1) * deltaRadius), -sa * (radius + (j + 1) * deltaRadius), j * deltaHeight);
                this.normals.push(...normal);
                this.texCoords.push(sCoord, 1 - deltaT * j);

                /* On the last iteration of this cycle we only need to add the vertices, 
                the normals and the texture coordinates to the corresponding arrays because 
                we always push the indeces for the triangles that make up the square above 
                the point*/
                if (j == this.stacks)
                    break;

                /* If we are iterating through the points of the last edge we only need to add the vertices, 
                the normals and the texture coordinates to the corresponding arrays because these points 
                overlap with the first ones */
                if (i == this.slices)
                    continue;
                
                // This is the index of the current vertix in the vertices array
                var index = i * (this.stacks + 1) + j;
                this.indices.push(index + this.stacks + 2, index + this.stacks + 1, index);
                this.indices.push(index, index + 1, index + this.stacks + 2);
            }

            ang += deltaAngle;
            sCoord += deltaS;
        }
        
        this.defaultTexCoords = [...this.texCoords];

        this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }

    /**
	 * @method scaleTex
	 * Updates the list of texture coordinates of the cylinder
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
	 * Updates the list of texture coordinates of the cylinder
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}