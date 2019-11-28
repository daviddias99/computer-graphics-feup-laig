/**
 * Class representing an animation segment. A segment is bounded by a start and an end keyframe. It's duration is the time between both keyframes and the animation matrix
 * is the interpolation of the keyframes according to the uorrent instant.
 */
class Segment {

    /**
     * @constructor Builds an animation segment. endKeyFrame.instant must be higher thatn startKeyFrame.instant
     * @param {Keyframe} startKeyFrame      Keyframe corresponding to the start of the segment
     * @param {Keyframe} endKeyFrame        Keyframe corresponding to the end of a segment 
     */
    constructor(startKeyFrame, endKeyFrame){

        this.startKeyFrame = startKeyFrame;
        this.endKeyFrame = endKeyFrame;

        // The duration of a segment is the time between the instants of it's bounding keyframes
        this.duration = this.endKeyFrame.getTimeMilli() - this.startKeyFrame.getTimeMilli();
    }


    /**
    * @method interpolateFrames
	 * Returns the transformation matrix corresponding to the interpolation of start and end Keyframes according to t
    * @param {Number} t    timeValue
    */
    interpolateFrames(t){

        // Time since the beginning of the segment
        let deltaT = t  - this.startKeyFrame.getTimeMilli();

        let transfMatrix = mat4.create();

        // Interpolate the translation

        let translCoords = arrayLinearInterpolation(deltaT,this.duration,0,this.endKeyFrame.translation,this.startKeyFrame.translation);
        transfMatrix = mat4.translate(transfMatrix, transfMatrix, translCoords);

        // Interpolate the rotation

        let rotCoords = arrayLinearInterpolation(deltaT,this.duration,0,this.endKeyFrame.rotation,this.startKeyFrame.rotation);
        transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, rotCoords[0]);
        transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, rotCoords[1]);
        transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, rotCoords[2]);

        // Interpolate the scalling

        let scaleCoords = arrayGeometricProgressionTerm(this.startKeyFrame.scale,this.endKeyFrame.scale,this.duration,deltaT);
        transfMatrix = mat4.scale(transfMatrix, transfMatrix, scaleCoords);   
        
        return transfMatrix;
    }


}