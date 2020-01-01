class Board {

    /**
     * @constructor                 Board constructor
     * @param {XMLscene} scene      Reference to the scene in which the board will be dispayed
     * @param {Array} primitives    Array of CGFobjects containing the primitives : [oct_tile, oct_piece, sqr_tile, sqr_piece]
     * @param {Number} rows         Number of rows of octagonal tiles/pieces
     * @param {Number} cols         Number of columns of octagonal tiles/pieces
     */
    constructor(scene, primitives, rows, cols)
    {
        this.scene = scene;
        this.primitives = primitives;
        this.rows = rows;
        this.cols = cols;

        this.initBoard();
        
    }

    initBoard()
    {
        this.outer_board = new Prism(this.scene, 4);
        this.plane = new MyPlane(this.scene, 10, 10);
        this.octagons = [];
        this.squares = [];

        let oct_radius = this.primitives[0].getRadius();
        let sqr_radius = this.primitives[2].getRadius();
        let oct_diagonal = oct_radius * Math.cos(Math.PI / 8.0) * 2.0;

        let spacing = oct_radius * 0.025;
        let oct_pos = sqr_radius + oct_diagonal / 2.0 + spacing;
        let sqr_pos = sqr_radius + spacing / 2.0;
        let delta = oct_diagonal + spacing;

        this.board_height = 0.1;
        this.board_scaling = [this.cols * oct_diagonal + 2 * sqr_radius + spacing * (this.cols - 1) * 2,1.0,this.rows * oct_diagonal + 2 * sqr_radius + spacing * (this.rows - 1) * 2];
        
        this.board_scale = this.board_scaling[0] >= this.board_scaling[2] ? 1 / this.board_scaling[0] : 1 / this.board_scaling[2];

        this.board_rotation = Math.PI / 4.0;
        this.board_translation = [Math.sqrt(0.5), 0.0, Math.sqrt(0.5)];

        this.auxBoards = new GameAuxiliaryBoards(this.scene,this.cols,this.rows,this.primitives,[oct_pos,delta]);

        for (let i = 0; i <= this.rows; i++)
        {
            let oct_line = [];
            let sqr_line = [];

            for (let j = 0; j <= this.cols; j++)
            {
                if (j < this.cols && i < this.rows)
                {
                    oct_line.push(new Tile([oct_pos + j * delta, this.board_height + 0.01, oct_pos + i * delta], [j, i], this.primitives[0], 8));
                }
                sqr_line.push(new Tile([sqr_pos + j * delta, this.board_height + 0.01, sqr_pos + i * delta], [j, i], this.primitives[2], 4));
            }
            if (i < this.rows)
                this.octagons[i] = oct_line;

            this.squares[i] = sqr_line;
        }

    }


    fillBoards(octagons, squares) {

        for (let i = 0; i < octagons.length; i++) {

            for (let j = 0; j < octagons[i].length; j++) {

                let octagon = octagons[i][j];

                if (octagon != 0) {

                    this.octagons[i][j].setPiece(new Piece(this.primitives[1], octagon));
                }
                else {
                    this.octagons[i][j].unsetPiece();
                }
            }
        }

        for (let i = 0; i < squares.length; i++) {

            for (let j = 0; j < squares[i].length; j++) {

                let square = squares[i][j];

                if (square != 0) {

                    this.squares[i][j].setPiece(new Piece(this.primitives[3], square));
                }
                else {
                    this.squares[i][j].unsetPiece();
                }
            }
        }

    }

    startAnimation(player,move){

        this.auxBoards.startAnimation(player,move);
    }

    display()
    {
        this.scene.pushMatrix();
        this.scene.scale(this.board_scale, this.board_scale, this.board_scale);

        this.scene.pushMatrix();
        this.scene.scale(...this.board_scaling);
        this.scene.translate(0.5, this.board_height, 0.5);
        this.plane.display();
        
        this.scene.translate(0.0, -this.board_height, 0.0);
        this.scene.rotate(this.board_rotation, 0.0, 1.0, 0.0);
        this.scene.scale(Math.sqrt(0.5), this.board_height, Math.sqrt(0.5));
        this.outer_board.display();
        this.scene.popMatrix();
        
        this.auxBoards.display();

        for (let i = 0; i <= this.rows; i++)
        {
            for (let j = 0; j <= this.cols; j++)
            {
                if (j < this.cols && i < this.rows)
                {
                    this.octagons[i][j].display();
                }
                this.squares[i][j].display();
            }
        }

        this.scene.popMatrix();
    }
}