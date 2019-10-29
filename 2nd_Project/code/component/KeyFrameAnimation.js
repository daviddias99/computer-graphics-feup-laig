class KeyFrameAnimation extends Animation {

    constructor(scene,id) {
        super(scene,id);
        this.keyframes = [];
        this.currentFrame = 0;
    }

    addKeyFrame(keyframe){

        this.keyframes.push(keyframe);
    }
    
    // TODO: implement the update method
    update(t) {

    }

    // TODO: implement the apply method
    apply() {

        
    }
}