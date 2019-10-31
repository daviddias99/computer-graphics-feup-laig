class KeyFrame {

   constructor(time,translation,rotation,scale){

    this.time = time;                           // time of scene corresponding to key frame (seconds)
    this.translation = translation;             // array of x,y,z translation of corresponding to the keyframe
    this.rotation = rotation;                   // array of x,y,z-axis rotations of corresponding to the keyframe
    this.scale = scale;                         // array of x,y,z scaling of corresponding to the keyframe
    this.frameDuration = 0;
   }

   static getNullKeyFrame(){

      return new KeyFrame(0,[0,0,0],[0,0,0],[1,1,1]);
   }

   getTimeMilli(){
      return this.time * 1000;
   }

   getFrameDurationMilli(){
      return this.frameDuration * 1000;
   }
}


