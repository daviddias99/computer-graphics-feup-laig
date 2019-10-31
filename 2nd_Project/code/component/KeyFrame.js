class KeyFrame {

   constructor(time,translation,rotation,scale){

    this.time = time * 1000;                    // duration of the keyframe
    this.translation = translation;             // array of x,y,z translation of corresponding to the keyframe
    this.rotation = rotation;                   // array of x,y,z-axis rotations of corresponding to the keyframe
    this.scale = scale;                         // array of x,y,z scaling of corresponding to the keyframe
   }

   static getNullKeyFrame(){

      return new KeyFrame(0,[0,0,0],[0,0,0],[1,1,1]);
   }
}


