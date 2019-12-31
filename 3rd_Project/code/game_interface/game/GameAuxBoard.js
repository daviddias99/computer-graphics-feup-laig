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

        this.aux1 = new GameAuxBoardPlayer(this.scene,this.cols,this.rows,1,this.primitives[1],-1,[this.oct_pos,this.delta]);
        this.aux2 = new GameAuxBoardPlayer(this.scene,this.cols,this.rows,2,this.primitives[1],1,[this.oct_pos,this.delta]);

    }

    display(){

        this.aux1.display();
        this.aux2.display();

    }

}

class GameAuxBoardPlayer{

    constructor(scene,cols,rows,player,piecePrimitive, type,arr){

        this.scene = scene;
        this.type = type;
        this.slots = [];
        this.arr = arr;

        for(let i = 0; i < cols; i++){
            this.slots.push(new GameAuxBoardSlot(scene,rows,player,i,piecePrimitive,type,arr));
        }

    }

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
        this.oct_pos = arr[0];
        this.delta = arr[1];
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