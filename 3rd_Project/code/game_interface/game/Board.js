class Board extends CGFobject {

    /**
     * 
     * @param {XMLscene} scene      Reference to the scene where the Board will be displayed
     * @param {Number} height       Number of octogons in a column
     * @param {Number} width        Number of octogons in a row
     */
    constructor(scene, height, width) {
        super(scene);

        this.height = height;
        this.width = width;

        this.initBoard();
    }

    initBoard() {
        this.octogons = [];
        this.squares = [];

        // TODO: the radius needs to change according to the tile
        this.oct_radius = 0.05;
        this.oct_diagonal = this.oct_radius * Math.cos(Math.PI / 8.0) * 2.0;
        this.side = this.oct_radius * Math.sin(Math.PI / 8.0) * 2.0;
        this.sqr_radius = Math.sqrt(Math.pow(this.side, 2) / 2.0);

        for (let i = 0; i <= this.height; i++) {
            let oct_line = [];
            let sqr_line = [];

            for (let j = 0; j <= this.width; j++) {
                if (j < this.width && i < this.height)
                    oct_line.push(new Tile(this.scene, 8, this.oct_radius));

                // if ((i > 0 && i < this.height) || (j > 0 && j < this.width)) {
                    sqr_line.push(new Tile(this.scene, 4, this.sqr_radius));
                // }
            }

            if (i < this.height)
                this.octogons[i] = oct_line;

            this.squares[i] = sqr_line;
        }

    }


    fillBoards(octagons, squares) {

        for (let i = 0; i < octagons.length; i++) {

            for (let j = 0; j < octagons[i].length; j++) {

                let octagon = octagons[i][j];

                if (octagon != 0) {

                    // TODO - PIECE HEIGHT AND RADIUS ???
                    this.octogons[i][j].setPiece(new Piece(this.scene, 8, null, null, octagon));
                }
            }
        }

        for (let i = 0; i < squares.length; i++) {

            for (let j = 0; j < squares[i].length; j++) {

                let square = squares[i][j];

                if (square != 0) {

                    // TODO - PIECE HEIGHT AND RADIUS ???
                    this.squares[i][j].setPiece(new Piece(this.scene, 4, null, null, octagon));
                }
            }
        }

    }

    display() {

        let oct_pos = this.sqr_radius + this.oct_diagonal / 2.0;
        for (let i = 0; i < this.octogons.length; i++) {
            for (let j = 0; i < this.octogons[i].length; j++) {
                this.scene.pushMatrix();
                this.scene.translate(oct_pos + i * this.oct_diagonal, 0.05, oct_pos + j * this.oct_diagonal);
                this.octogons[i][j].display();
                this.scene.popMatrix();
            }
        }

        for (let i = 0; i < this.squares.length; i++) {
            for (let j = 0; i < this.squares[i].length; j++) {
                this.scene.pushMatrix();
                this.scene.translate(this.square_radius + i * this.oct_diagonal, 0.05, this.square_radius + j * this.oct_diagonal);
                this.squares[i][j].display();
                this.scene.popMatrix();
            }
        }
    }
}