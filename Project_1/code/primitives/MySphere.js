class MySphere extends CGFobject {

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
        this.texCoodrs = [];

        
        var phi = 0;
        var deltaPhi = 2 * Math.PI / this.slices;
        var deltaTheta = (Math.PI / 2) / this.stacks;

        // var sCoord = 0;
        // var deltaS = 1 / this.slices;
        // var deltaT = 1 / this.stacks;

        var trueStacks = 2 * this.stacks;


        for (var i = 0; i <= this.slices; i++) {

            var cosPhi = Math.cos(phi);
            var sinPhi = Math.sin(phi);
            var theta = -Math.PI/2;
            
            // Iterate through all the points on the same edge
            for (var j = 0; j <= trueStacks; j++) {

                
                var cosTheta = Math.cos(theta);
                var sinTheta = Math.sin(theta);

                var vertex = [this.radius * cosTheta * cosPhi
                            ,this.radius * cosTheta * sinPhi
                            ,this.radius * sinTheta];

                this.vertices.push(...vertex);
                this.normals.push(...normalizeVector(vertex));


                if (j == this.stacks)
                    break;


                if (i == this.slices)
                    continue;

                // This is the index of the current vertix in the vertices array
                var index = i * (trueStacks + 1) + j;
                this.indices.push( index, index + trueStacks + 1,index + trueStacks + 2);
                this.indices.push(index + trueStacks + 2,index + 1,index);


                theta += deltaTheta;
            }

            phi += deltaPhi;
            // sCoord += deltaS;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}