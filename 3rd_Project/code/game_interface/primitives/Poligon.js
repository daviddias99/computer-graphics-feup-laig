class Poligon extends CGFobject {

    constructor(scene, sides) {
        super(scene);

        this.sides = sides;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let ang = 0;
        let alpha = 2 * Math.PI / this.sides;

        this.vertices.push(0, 0, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0.5);

        for (let i = 0; i < this.sides; i++) {
            let sa = Math.sin(ang);
            let ca = Math.cos(ang);

            this.vertices.push(ca, 0, -sa);
            this.texCoords.push(0.5 + ca * 0.5, -0.5 * sa + 0.5);

            let normal = [0, 1, 0];
            this.normals.push(...normal);

            if (i < this.sides - 1)
                this.indices.push(i + 1, i + 2, 0);
            else
                this.indices.push(i + 1, 1, 0)

            ang += alpha;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}