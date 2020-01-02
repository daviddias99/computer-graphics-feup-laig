class GameAuxiliaryBoards {

    constructor(scene,cols,rows,primitives,spacings,material){

        this.scene = scene;
        this.cols = cols;
        this.rows = rows;
        this.primitives = primitives;
        this.spacings = spacings;
        this.material = material;

        this.init();
    }

    init(){

        // On auxiliary board for each player
        this.boards = [];
        this.boards[0] = new GameAuxiliaryBoard(this.scene,this.cols,this.rows,1,this.primitives[1],-1,this.spacings,this.material);
        this.boards[1] = new GameAuxiliaryBoard(this.scene,this.cols,this.rows,2,this.primitives[1],1,this.spacings,this.material);
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

    constructor(scene,cols,rows,player,piecePrimitive,type,arr,material){

        this.scene = scene;
        this.slots = [];
        this.pieceFeed = [];
        this.arr = arr;
        this.pieceOnAnimation = null;
        this.pieceDirection = null;
        this.aux_board_primitive_side = new Prism(this.scene, 4);
        this.aux_board_primitive_top = new MyPlane(this.scene, 10, 10);
        this.type = type;
        this.material = material;

        if(type == -1){
            this.addition = 0;
        }
        else {
            this.addition = rows - 1;
        }

        for(let i = 0; i < cols; i++){
            this.slots.push(new GameAuxBoardSlot(scene,rows,player,i,piecePrimitive,type,arr));
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
        let finalPos = this.slots[move.x].getPosition(move.x,move.y,0);
        let initialPos = this.pieceOnAnimation.pos;
        let height = 0.5;
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

        let auxBoardPosition = [0,0.05, this.arr[0] + (this.type * 1.5 + this.addition) * this.arr[1]];

        this.material.apply();
        this.scene.pushMatrix();        

        this.scene.pushMatrix();  
        this.scene.translate(...auxBoardPosition);
        this.scene.scale(...this.arr[2]);
        this.scene.translate(0.5,0,0);

        this.scene.pushMatrix();
        this.scene.translate(0.0,0.05,0);
        this.aux_board_primitive_top.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0.0,-0.05,0);
        this.scene.rotate(Math.PI,1,0,0);
        this.aux_board_primitive_top.display()
        this.scene.popMatrix();
        
        this.scene.translate(0.0, -0.05,0);
        this.scene.rotate(Math.PI / 4.0, 0.0, 1.0, 0.0);
        this.scene.scale(Math.sqrt(0.5), 0.1, Math.sqrt(0.5));
        this.aux_board_primitive_side.display();
        this.scene.popMatrix();

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