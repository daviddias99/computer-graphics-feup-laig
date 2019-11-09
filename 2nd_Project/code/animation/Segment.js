class Segment {

    constructor(startKeyFrame, endKeyFrame){

        this.startKeyFrame = startKeyFrame;
        this.endKeyFrame = endKeyFrame;
        this.duration = this.endKeyFrame.getTimeMilli() - this.startKeyFrame.getTimeMilli();
    }


    interpolateFrames(t){

        let deltaT = t  - this.startKeyFrame.getTimeMilli();

        let transfMatrix = mat4.create();

        let translCoords = arrayLinearInterpolation(deltaT,this.duration,0,this.endKeyFrame.translation,this.startKeyFrame.translation);
        transfMatrix = mat4.translate(transfMatrix, transfMatrix, translCoords);

        let rotCoords = arrayLinearInterpolation(deltaT,this.duration,0,this.endKeyFrame.rotation,this.startKeyFrame.rotation);
        transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, rotCoords[0]);
        transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, rotCoords[1]);
        transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, rotCoords[2]);

        let scaleCoords = arrayGeometricProgressionTerm(this.startKeyFrame.scale,this.endKeyFrame.scale,this.duration,deltaT);
        transfMatrix = mat4.scale(transfMatrix, transfMatrix, scaleCoords);   
        
        return transfMatrix;
    }


}