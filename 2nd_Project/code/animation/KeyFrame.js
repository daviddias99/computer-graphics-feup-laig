class KeyFrame {

   constructor(time,translation,rotation,scale){

    this.time = time;                           // time of scene corresponding to key frame (seconds)
    this.translation = translation;             // array of x,y,z translation of corresponding to the keyframe
    this.rotation = rotation;                   // array of x,y,z-axis rotations of corresponding to the keyframe
    this.scale = scale;                         // array of x,y,z scaling of corresponding to the keyframe
   }

   static getNullKeyFrame(){

      return new KeyFrame(0,[0,0,0],[0,0,0],[1,1,1]);
   }

   getTimeMilli(){
      return this.time * 1000;
   }

   getMatrix(){
      let transfMatrix = mat4.create();

      transfMatrix = mat4.translate(transfMatrix, transfMatrix, this.translation);
      transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, this.rotation[0]);
      transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, this.rotation[1]);
      transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, this.rotation[2]);
      transfMatrix = mat4.scale(transfMatrix, transfMatrix, this.scale);   
      
      return transfMatrix;
   }

}


