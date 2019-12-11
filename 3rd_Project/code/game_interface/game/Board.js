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
        this.octogons = [][];
        this.squares = [][];

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
                    this.octogons[i][j] = new Tile(this.scene, 8, this.oct_radius);

                if ((i > 0 && i < this.height) || (j > 0 && j < this.width)) {
                    this.squares = [i][j] = new Tile(this.scene, 4, this.sqr_radius);
                }
            }
        }
    }

    fillBoards(octagons, squares){

        for(let i = 0; i < octagons.length; i++){

            for(let j = 0; j < octagons[i].length; j++){

                let octagon = octagons[i][j];

                if(octagon != 0){

                    // TODO - PIECE HEIGHT AND RADIUS ???
                    this.octogons[i][j].setPiece(new Piece(this.scene,8, null,null,octagon));
                }
            }
        }

        for(let i = 0; i < squares.length; i++){

            for(let j = 0; j < squares[i].length; j++){

                let square = squares[i][j];

                if(square != 0){

                    // TODO - PIECE HEIGHT AND RADIUS ???
                    this.squares[i][j].setPiece(new Piece(this.scene,4, null,null,octagon));
                }
            }
        }

    }

    display() {
        let oct_row = this.sqr_radius + this.oct_diagonal / 2.0;
        let oct_col = oct_row;
        let sqr_row = this.sqr_radius;
        let sqr_col = this.sqr_radius;

        for (let i = 0; i <= this.height; i++) {
            for (let j = 0; j <= this.width; j++) {
                if (j < this.width && i < this.height) {
                    // display octogon
                    this.scene.pushMatrix();
                    this.scene.translate(oct_col, 0.0, oct_row);
                    this.octogons[i][j].display();
                    this.scene.popMatrix();

                    oct_col += this.oct_diagonal / 2.0;
                }

                if ((i > 0 && i < this.height) || (j > 0 && j < this.width)) {
                    // display octogon
                    this.scene.pushMatrix();
                    this.scene.translate(sqr_col, 0.0, sqr_row);
                    this.squares[i][j].display();
                    this.scene.popMatrix();
                }

                sqr_col += this.oct_diagonal;
            }

            oct_col = this.sqr_radius + this.oct_diagonal / 2.0;
            oct_row += this.oct_diagonal / 2.0;

            sqr_col = this.sqr_radius;
            sqr_row = this.sqr_radius;
        }

    }
}