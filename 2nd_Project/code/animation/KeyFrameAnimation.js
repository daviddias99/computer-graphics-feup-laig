/**
 * Class representing and implementation of an animation using keyframes
 */
class KeyFrameAnimation extends Animation {

    /**
     * @constructor Constructor of a keyframe animation
     * @param {XMLScene} scene         XMLScene where the animation will take place
     * @param {Number} id              Unique id of the Animation
     * @param {Array} keyframes        Array of Keyframe Objects 
     */
    constructor(scene,id,keyframes) {
        super(scene,id);


        // Store the animations keyframes. The null keyframe is added at the start of the array.
        this.keyframes = [];
        this.keyframes.push(KeyFrame.getNullKeyFrame());
        this.keyframes.push(...keyframes);
        
        // Start the time keeping. SumT stores the real time that passed since the beginning of the animation
        this.sumT = 0;
    }

    /**
    * @method addKeyFrame
	 * Add given keyframe to the keyframe array
    * @param {Keyframe} keyframe    keyframe to be added
    */
    addKeyFrame(keyframe){

        this.keyframes.push(keyframe);
    }    

    /**
    * @method getActiveSegment
	 * Returns the active segment that corresponds to the current instant (sumT). If the animation is over, that is , there is no segment that fits the current time
     * null is returned. A segment corresponds to the interval between two keyframes and has an transformation matrix equal to the interpolation of the two.
    */
    getActiveSegment(){

        for(let i = 0; i < this.keyframes.length - 1; i++){
            
            // Check if the current time(sumT) is between the instants of two consecutive frames
            if( (this.sumT >= this.keyframes[i].getTimeMilli()) && (this.sumT < this.keyframes[i+1].getTimeMilli())){
                return new Segment( this.keyframes[i], this.keyframes[i+1]);
            }
        }

        return null;
    }

    /**
     * @method update
     *  Update the current time(sumT), the active segment if needed and the transformation matrix of the animation. If the animation is not being used no action is performed.
     * @param {Number} t    Current time value of the scene in milliseconds
     */
    update(t) {

        // If the animation is over there is no need to update the matrix
        if(!this.inUse)
            return;

        // Update the current time
        this.sumT += t;

        // Update the active segment
        let activeSegment = this.getActiveSegment();

        if(activeSegment){

            // The transformation matrix is the interpolation of the two keyframes of the active segment
            this.transformationMatrix = activeSegment.interpolateFrames(this.sumT);
        }
        else {
            // Animation is over so the transformation matrix is the one corresponding to the last keyframe of the animation
            this.transformationMatrix = this.keyframes[this.keyframes.length -1].getMatrix();
            this.inUse = false;
        }
    }
}