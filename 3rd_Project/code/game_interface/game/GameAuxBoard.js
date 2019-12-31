class GameAuxBoard {


    constructor(scene,cols,rows,primitives,dimensions){

        this.scene = scene;
        this.cols = cols;
        this.rows = rows;
        this.primitives = primitives;
        // this.piece = new Piece(this.primitives[1], 1);
        this.plane = new MyPlane(this.scene, 10, 10);
        this.dimensions = dimensions;


        this.init();
    }

    init(){

        let oct_radius = this.primitives[0].getRadius();
        let sqr_radius = this.primitives[2].getRadius();
        let oct_diagonal = oct_radius * Math.cos(Math.PI / 8.0) * 2.0;

        let spacing = oct_radius * 0.025;
        this.oct_pos = sqr_radius + oct_diagonal / 2.0 + spacing;
        this.sqr_pos = sqr_radius + spacing / 2.0;
        this.delta = oct_diagonal + spacing;

        this.aux_board_width = this.cols * oct_diagonal + 2 * sqr_radius + spacing * (this.cols - 1) * 2;
        this.aux_board_length = oct_diagonal +  sqr_radius + spacing * 2;

        this.board_height = 0.1;
        this.board_scaling = [1,1.0, 1/this.rows];
        this.board_rotation = Math.PI / 4.0;
        this.board_translation = [Math.sqrt(0.5), 0.0, Math.sqrt(0.5)];

        this.board_side = this.cols * oct_diagonal + 2 * sqr_radius + spacing * (this.cols - 1) * 2;

        this.aux1 = new GameAuxBoardPlayer(this.scene,this.cols,this.rows,1,this.primitives[1],this.board_scaling,this.aux_board_length,0.1,-1,[this.oct_pos,this.delta]);
        this.aux2 = new GameAuxBoardPlayer(this.scene,this.cols,this.rows,2,this.primitives[1],this.board_scaling,this.aux_board_length,0.1,1,[this.oct_pos,this.delta]);

        this.piecePos = [this.oct_pos + 2 * this.delta, this.board_height + 0.01, this.oct_pos + 3 * this.delta];

    }


    //[this.board_height,this.board_scaling,this.board_rotation,this.board_translation]
    display(){

        this.aux1.display();
        this.aux2.display();

        this.scene.pushMatrix();
        this.scene.translate(0, this.board_height, -0.6);
        // this.scene.translate(...this.piecePos);
        // this.scene.translate(...this.getFinalPosition(2,3));
        this.scene.rotate(Math.PI / 8, 0, 1, 0);
        // this.piece.display();
        this.scene.popMatrix();
        // this.scene.translate(0.0, - this.dimensions[0], 0.0);
        // this.scene.scale(Math.sqrt(0.5), this.board_height, Math.sqrt(0.5));
        // this.scene.rotate(this.board_rotation, 0.0, 1.0, 0.0);
        // this.outer_board.display();
    }

    displaySlots(){

        this.aux1.displaySlots();
        this.aux2.displaySlots();
    }
}

class GameAuxBoardPlayer{

    constructor(scene,cols,rows,player,piecePrimitive,scaling,aux_board_length, offset, type,arr){

        this.aux_board_length = aux_board_length;
        this.rows = rows;
        this.offset = offset;
        this.scene = scene;
        this.scaling = scaling;
        this.type = type;
        this.slots = [];
        this.plane = new MyPlane(this.scene, 10, 10);
        this.arr = arr;
        this.oct_pos = this.arr[0];
        this.delta = this.arr[1];

        for(let i = 0; i < cols; i++){
            this.slots.push(new GameAuxBoardSlot(scene,rows,player,i,piecePrimitive,type,arr));
        }

    }



    // display(){

    //     this.scene.pushMatrix();
    //     this.scene.translate(0,0,0.5 * this.type);
    //     this.scene.scale(...this.scaling);
    //     this.scene.translate(0,0, this.type * (this.aux_board_length + this.offset));
    //     this.plane.display();
    //     this.scene.popMatrix();
    // }

    display(){

        this.scene.pushMatrix();        

        for(let i = 0; i < this.slots.length; i++){
   
            this.slots[i].display();
        }

        this.scene.popMatrix();
    }

}

class GameAuxBoardSlot{

    constructor(scene,rows,player,colNumber,piecePrimitive, type,arr){

        this.scene = scene;
        this.colNumber = colNumber;
        this.pieces = [];
        this.arr = arr;
        this.oct_pos = this.arr[0];
        this.delta = this.arr[1];
        this.type = type;
        this.piecePrimitive = piecePrimitive;

        this.addition;

        if(type == -1){

            this.addition = 0;
        }
        else {
            this.addition = rows - 1;
        }

        for(let i = 0; i < rows - 1; i++){
            this.pieces.push(new MovingPiece(scene,piecePrimitive,player,this.getPosition(...[this.colNumber,this.addition + this.type * 1.5,i])));
        }


    }

    getPosition(h,v,height){

        return [this.oct_pos + h * this.delta,0.1 + this.piecePrimitive.height * height, this.oct_pos + v * this.delta];
    }

    display(){

        for(let i = 0; i < this.pieces.length; i++){

            this.scene.pushMatrix();
            this.pieces[i].display();
            this.scene.popMatrix();
        }
    }

}