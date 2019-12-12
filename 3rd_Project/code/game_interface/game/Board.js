class Board extends CGFobject {

    /**
     * 
     * @param {XMLscene} scene          Reference to the scene where the Board will be displayed
     * @param {Number} height           Number of octagons in a column
     * @param {Number} width            Number of octagons in a row
     * @param {Number} sqr_material     Material that will be applied to the square tiles
     * @param {Number} oct_material     Material that will be applied to the octagonal tiles
     */
    constructor(scene, height, width, sqr_material, oct_material) {
        super(scene);

        this.height = height;
        this.width = width;

        this.sqr_material = sqr_material;
        this.oct_material = oct_material;

        this.initBoard();
    }

    initBoard() {
        this.octagons = [];
        this.squares = [];

        this.oct_radius = 0.05;
        this.oct_diagonal = this.oct_radius * Math.cos(Math.PI / 8.0) * 2.0;
        this.side = this.oct_radius * Math.sin(Math.PI / 8.0) * 2.0;
        this.sqr_radius = Math.sqrt(Math.pow(this.side, 2) / 2.0);

        for (let i = 0; i <= this.height; i++) {
            let oct_line = [];
            let sqr_line = [];

            for (let j = 0; j <= this.width; j++) {
                if (j < this.width && i < this.height) {
                    oct_line.push(new Tile(this.scene, 8, this.oct_radius));
                }
                sqr_line.push(new Tile(this.scene, 4, this.sqr_radius));
            }

            if (i < this.height)
                this.octagons[i] = oct_line;

            this.squares[i] = sqr_line;
        }
    }

    display() {        
        let pick_id = 1;
        
        let oct_pos = this.sqr_radius + this.oct_diagonal / 2.0;

        for (let i = 0; i < this.octagons.length; i++) {
            for (let j = 0; j < this.octagons[i].length; j++) {
                this.scene.pushMatrix();
                this.scene.translate(oct_pos + i * this.oct_diagonal, 0.05, oct_pos + j * this.oct_diagonal);
                this.scene.rotate(Math.PI / 8, 0, 1, 0);
                this.scene.registerForPick(pick_id, this.octagons[i][j]);
                this.oct_material.apply();
                this.octagons[i][j].display();
                this.scene.popMatrix();

                pick_id++;
            }
        }

        for (let i = 0; i < this.squares.length; i++) {
            for (let j = 0; j < this.squares[i].length; j++) {
                this.scene.pushMatrix();   
                this.scene.translate(this.sqr_radius + i * this.oct_diagonal, 0.05, this.sqr_radius + j * this.oct_diagonal);
                this.sqr_material.apply();
                this.squares[i][j].display();
                this.scene.popMatrix();
            }
        }
    }
}