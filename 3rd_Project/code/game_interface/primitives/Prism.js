class Prism extends CGFobject {
    
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

        for (let i = 0; i < this.sides; i++) {
            
            let sa = Math.sin(ang);
            let saa = Math.sin(ang + alpha);
            let ca = Math.cos(ang);
            let caa = Math.cos(ang + alpha);

            this.vertices.push(ca, 0, -sa);
            this.vertices.push(caa, 0, -saa);
            this.vertices.push(ca, 1, -sa);
            this.vertices.push(caa, 1, -saa);

            let normal = [saa - sa, 0, caa - ca];
            normal = normalizeVector(normal);

            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);

            this.indices.push(4 * i + 2, 4 * i, 4 * i + 1);
            this.indices.push(4 * i + 1, 4 * i + 3, 4 * i + 2);

            let tex = [
                i / this.sides, 1,
                (i + 1) / this.sides, 1,
                i / this.sides, 0,
                (i + 1) / this.slices, 0
            ];
            this.texCoords.push(...tex);

            ang += alpha;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}