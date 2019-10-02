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
            this.p3[0], this.p3[1], this.p3[2]      //2
        ];

        this.indices = [
            0, 1, 2
        ];
        
        var vecA = subtractArrays(this.p1, this.p2);
        var vecB = subtractArrays(this.p1, this.p3);
        
        var normal = normalizeVector(crossProduct(vecA, vecB));
        
        this.normals = [];
        this.normals.push(...normal, ...normal, ...normal);
        
        this.textureMapping();
        
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
}