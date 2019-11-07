class KeyFrameAnimation extends Animation {

    constructor(scene,id,keyframes) {
        super(scene,id);

        this.keyframes = [];
        this.keyframes.push(KeyFrame.getNullKeyFrame());
        this.keyframes.push(...keyframes);
        
        this.currentFrame = 1;
        this.sumT = 0;
    }

    addKeyFrame(keyframe){

        this.keyframes.push(keyframe);
    }    

    getActiveSegment(){

        for(let i = 0; i < this.keyframes.length - 1; i++){

            if( (this.sumT > this.keyframes[i].getTimeMilli()) && (this.sumT < this.keyframes[i+1].getTimeMilli())){

                return new Segment( this.keyframes[i], this.keyframes[i+1]);
            }
        }

        return null;
    }

    update(t) {

        // If the animation is over there is no need to update the matrix
        if(this.animationOver)
            return;

        this.sumT += t;

        let activeSegment = this.getActiveSegment();

        if(activeSegment){
            this.transformationMatrix = activeSegment.interpolateFrames(this.sumT);
        }
        else {
            this.transformationMatrix = this.keyframes[this.keyframes.length -1].getMatrix();
            this.animationOver = true;
        }
    }

   


}