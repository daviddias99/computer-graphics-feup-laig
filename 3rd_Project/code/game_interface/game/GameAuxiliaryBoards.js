class GameAuxiliaryBoards {

    constructor(scene,cols,rows,primitives,spacings){

        this.scene = scene;
        this.cols = cols;
        this.rows = rows;
        this.primitives = primitives;
        this.spacings = spacings;

        this.init();
    }

    init(){

        this.boards = [];
        this.boards[0] = new GameAuxiliaryBoard(this.scene,this.cols,this.rows,1,this.primitives[1],-1,this.spacings);
        this.boards[1] = new GameAuxiliaryBoard(this.scene,this.cols,this.rows,2,this.primitives[1],1,this.spacings);
    }

    display(){

        this.boards[0].display();
        this.boards[1].display();
    }

    startAnimation(player,move){

        this.boards[player-1].startAnimation(move);
    }

    update(time){

        this.boards[0].update(time);
        this.boards[1].update(time);
    }

    animationOnGoing(){

        return this.boards[0].pieceOnAnimation || this.boards[1].pieceOnAnimation;
    }

}

class GameAuxiliaryBoard{

    constructor(scene,cols,rows,player,piecePrimitive,type,arr){

        this.scene = scene;
        this.slots = [];
        this.arr = arr;

        this.pieceOnAnimation = null;

        for(let i = 0; i < cols; i++){
            this.slots.push(new GameAuxBoardSlot(scene,rows,player,i,piecePrimitive,type,arr));
        }

    }

    startAnimation(move){

        this.pieceOnAnimation = this.slots[move.x].pieces.pop();
        
        let finalPos = this.slots[move.x].getPosition(move.x,move.y,0);
        let height = 0.5;
        let animationTime = 0.5;
        let effectiveKeyframeCount = 20;
        let keyframes =  QuadraticKfGenerator.generateKeyFrames(this.pieceOnAnimation.pos,finalPos,height,animationTime,effectiveKeyframeCount);
        let kfAnimation = new KeyFrameAnimation(this.scene,0,keyframes);

        kfAnimation.inUse = true;
        this.pieceOnAnimation.animation = kfAnimation;
    }

    display(){

        this.scene.pushMatrix();        

        for(let i = 0; i < this.slots.length; i++){
   
            this.slots[i].display();
        }

        if(this.pieceOnAnimation){

            this.pieceOnAnimation.display();
        }

        this.scene.popMatrix();
    }

    update(time){

    
        if(this.pieceOnAnimation){

            this.pieceOnAnimation.animation.update(time);

            if(!this.pieceOnAnimation.animation.inUse){

                this.pieceOnAnimation = null;
            }
        }

    }

}

class GameAuxBoardSlot{

    constructor(scene,maxPieces,player,colNumber,piecePrimitive, type, spacings){

        this.scene = scene;
        this.colNumber = colNumber;
        this.pieces = [];
        this.oct_pos = spacings[0];
        this.delta = spacings[1];
        this.type = type;
        this.piecePrimitive = piecePrimitive;

        this.addition;

        if(type == -1){
            this.addition = 0;
        }
        else {
            this.addition = maxPieces - 1;
        }

        for(let i = 0; i < maxPieces ; i++){
            this.pieces.push(new MovingPiece(scene,piecePrimitive,player,this.getPosition(...[this.colNumber,this.addition + this.type * 1.5,i])));
        }

    }

    getPosition(h,v,height){

        return [this.oct_pos + h * this.delta,0.1 + this.piecePrimitive.height * height, this.oct_pos + v * this.delta];
    }

    display(){

        for(let i = 0; i < this.pieces.length; i++){

            this.pieces[i].display();
            
        }
    }

}