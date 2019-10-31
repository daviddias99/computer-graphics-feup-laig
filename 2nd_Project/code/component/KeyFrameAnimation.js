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

        for(var i = this.keyframes.length - 1; i > 0; i--){

            this.keyframes[i].time -= this.keyframes[i-1].time;
        }

        return;
    }
    
    // TODO: implement the update method
    update(t) {

        if(this.animationOver)
            return;

        this.sumT += t;

        if(this.sumT > this.keyframes[this.currentFrame].time){

            this.sumT -= this.keyframes[this.currentFrame].time;
            this.currentFrame ++;
            console.log("ola");

            if(this.currentFrame == this.keyframes.length){
                this.animationOver = true;
                this.currentFrame--;
                return;
            }

        }

        if(this.currentFrame > 0){
            this.transformationMatrix = this.interpolateFrames(this.sumT,this.keyframes[this.currentFrame-1],this.keyframes[this.currentFrame]);
        }

    }

    interpolateFrames(t,frame1,frame2){

        var transfMatrix = mat4.create();

        var currentX = linearInterpolation(t,frame2.time,0,frame2.translation[0],frame1.translation[0]);
        var currentY = linearInterpolation(t,frame2.time,0,frame2.translation[1],frame1.translation[1]);
        var currentZ = linearInterpolation(t,frame2.time,0,frame2.translation[2],frame1.translation[2]);

        var coordinates = [currentX,currentY,currentZ];
        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);

        currentX = linearInterpolation(t,frame2.time,0,frame2.rotation[0],frame1.rotation[0]);
        currentY = linearInterpolation(t,frame2.time,0,frame2.rotation[1],frame1.rotation[1]);
        currentZ = linearInterpolation(t,frame2.time,0,frame2.rotation[2],frame1.rotation[2]);

        coordinates = [currentX,currentY,currentZ];
        transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, currentX);
        transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, currentY);
        transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, currentZ);

        var n = frame2.time;
        var ratioX = Math.pow(frame2.scale[0]/frame1.scale[0], 1/n);
        var ratioY = Math.pow(frame2.scale[1]/frame1.scale[1], 1/n);
        var ratioZ = Math.pow(frame2.scale[2]/frame1.scale[2], 1/n);

        var scalingStep = t;

        var currentXSclFactor = frame1.scale[0] * Math.pow(ratioX,scalingStep);
        var currentYSclFactor = frame1.scale[1] * Math.pow(ratioY,scalingStep);;
        var currentZSclFactor = frame1.scale[2] * Math.pow(ratioZ,scalingStep);;

        var scaleFactors = [currentXSclFactor,currentYSclFactor,currentZSclFactor]
        transfMatrix = mat4.scale(transfMatrix, transfMatrix, scaleFactors);   
        
        return transfMatrix;
    }


}