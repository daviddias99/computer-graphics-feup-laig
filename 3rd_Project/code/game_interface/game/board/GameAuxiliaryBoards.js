class AuxiliaryBoards {

    constructor(scene,cols,rows,primitives,material,boardPrimitive){

        this.scene = scene;
        this.cols = cols;
        this.rows = rows;
        this.primitives = primitives;
        this.material = material;
        this.boardPrimitive = boardPrimitive;

        this.init();
    }

    init(){

        // On auxiliary board for each player
        this.boards = [];
        this.boards[0] = new AuxiliaryBoard(this.scene,this.cols,this.rows,1,this.primitives[1],-1,this.material,this.boardPrimitive);
        this.boards[1] = new AuxiliaryBoard(this.scene,this.cols,this.rows,2,this.primitives[1],1,this.material,this.boardPrimitive);
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

class AuxiliaryBoard{

    constructor(scene,cols,rows,player,piecePrimitive,type,material,boardPrimitive){

        this.scene = scene;
        this.slots = [];
        this.pieceFeed = [];
        this.pieceOnAnimation = null;
        this.pieceDirection = null;
        this.auxBoardPrimitive = new AuxiliaryBoardPrimitive(scene,rows,boardPrimitive,type,material);
        this.boardPrimitive = boardPrimitive;
        this.type = type;
        this.material = material;

        for(let i = 0; i < cols; i++){
            this.slots.push(new AuxiliaryBoardSlot(scene,rows,player,i,piecePrimitive,type,boardPrimitive));
        }

    }

    startAnimation(move){

        if(move == 'undo')
            this.startUndoAnimation();
        else
            this.startRegularAnimation(move);
    }

    startUndoAnimation(){
        
        // Remove the last piece that was added to the storage of pieces that left the auxiliary board
        let status = this.pieceFeed.pop();
        this.pieceOnAnimation = status[1];
        this.pieceDirection = status[0];

        // Start the animation back to the auxiliary board
        this.pieceOnAnimation.animation.startReverseAnimation();
    }

    startRegularAnimation(move){

        // Remove the piece that is on top of the stack of it's color that is in the same column
        this.pieceOnAnimation = this.slots[move.x].pieces.pop();
        
        // Animation calibration
        let finalPos = this.boardPrimitive.getPosition(move.x,move.y,0,'octagon');
        let initialPos = this.pieceOnAnimation.pos;
        let height = this.boardPrimitive.cols * 0.1;
        let animationTime = 0.5;
        let effectiveKeyframeCount = 20;

        // Animation creation
        let keyframes =  QuadraticKfGenerator.generateKeyFrames(initialPos,finalPos,height,animationTime,effectiveKeyframeCount);
        let kfAnimation = new KeyFrameAnimation(this.scene,0,keyframes);
        kfAnimation.inUse = true;

        // Set "global values"
        this.pieceOnAnimation.animation = kfAnimation;
        this.pieceDirection = 'board';                              // signal that the animation is from the aux-board to the regular board
        
        // add this piece to the storage of pieces that left the aux-board the x position of the piece is added to identify the slot from which it came from
        this.pieceFeed.push([move.x,this.pieceOnAnimation]);        
    }

    display(){

        this.auxBoardPrimitive.display();

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

            // If the animation is over
            if(!this.pieceOnAnimation.animation.inUse){

                // If the piece was headed to the board, remove it from the "on animation" slot
                if(this.pieceDirection == 'board'){

                    this.pieceOnAnimation = null;
                }
                // If the piece was headed to the aux-board, added it to the correct slot and remove it from the "on animation" slot
                else {
                    
                    this.slots[this.pieceDirection].pieces.push(this.pieceOnAnimation);
                    this.pieceOnAnimation = null;
                }
            }
        }

    }

}

class AuxiliaryBoardSlot{

    constructor(scene,maxPieces,player,colNumber,piecePrimitive, type,boardPrimitive){

        this.scene = scene;
        this.colNumber = colNumber;
        this.pieces = [];
        this.type = type;
        this.piecePrimitive = piecePrimitive;
        this.boardPrimitive = boardPrimitive;

        this.addition;

        if(type == -1){
            this.addition = 0;
        }
        else {
            this.addition = maxPieces - 1;
        }

        for(let i = 0; i < maxPieces ; i++){
            this.pieces.push(new MovingPiece(scene,piecePrimitive,player,this.boardPrimitive.getPosition(...[this.colNumber,this.addition + this.type * 1.37,i,"octagon"])));
        }

    }

    display(){

        for(let i = 0; i < this.pieces.length; i++){

            this.pieces[i].display();
            
        }
    }

}