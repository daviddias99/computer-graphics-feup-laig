class KeyFrameAnimation extends Animation {

    constructor(scene,id,keyframes) {
        super(scene,id);

        this.keyframes = [];
        this.keyframes.push(KeyFrame.getNullKeyFrame());
        this.keyframes.push(...keyframes);
        this.normalizeTimes();
        
        this.currentFrame = 1;
        this.sumT = 0;
    }

    addKeyFrame(keyframe){

        this.keyframes.push(keyframe);
    }

    normalizeTimes(){

        for(var i = this.keyframes.length - 1; i > 0; i--)
            this.keyframes[i].frameDuration = this.keyframes[i].time - this.keyframes[i-1].time;
        
        return;
    }
    
    // TODO: implement the update method
    update(t) {

        // If the animation is over there is no need to update the matrix
        if(this.animationOver)
            return;

        this.sumT += t;

        // Check for need to switch to next keyframe
        if(this.sumT > this.keyframes[this.currentFrame].getFrameDurationMilli()){

            // Bound sumT to the overlaying time value
            this.sumT -= this.keyframes[this.currentFrame].getFrameDurationMilli();

            // Next frame
            this.currentFrame ++;

            // If last frame, end animation
            if(this.currentFrame == this.keyframes.length){
                this.animationOver = true;
                return;
            }

        }

        // Update the animation matrix by interpolating frames
        if(this.currentFrame > 0){
            this.transformationMatrix = this.interpolateFrames(this.sumT,this.keyframes[this.currentFrame-1],this.keyframes[this.currentFrame]);
        }

    }

    interpolateFrames(t,frame1,frame2){

        var transfMatrix = mat4.create();

        var translCoords = arrayLinearInterpolation(t,frame2.getFrameDurationMilli(),0,frame2.translation,frame1.translation);
        transfMatrix = mat4.translate(transfMatrix, transfMatrix, translCoords);

        var rotCoords = arrayLinearInterpolation(t,frame2.getFrameDurationMilli(),0,frame2.rotation,frame1.rotation);
        transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, rotCoords[0]);
        transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, rotCoords[1]);
        transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, rotCoords[2]);

        var scaleCoords = arrayGeometricProgressionTerm(frame1.scale,frame2.scale,frame2.getFrameDurationMilli(),t);
        transfMatrix = mat4.scale(transfMatrix, transfMatrix, scaleCoords);   
        
        return transfMatrix;
    }


}