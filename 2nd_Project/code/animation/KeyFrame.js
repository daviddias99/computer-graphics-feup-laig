/**
 * Class to represent a keyframe that is part of a keyframe animation. A keyframe is represented by the instant in which it is bound to and the
 * transformations associated with it.
 */
class KeyFrame {

   /**
    * @constructor                  Keyframe consructor
    * @param {Number} time          Time of scene corresponding to key frame (seconds)
    * @param {Array} translation    Array of x,y,z translation of corresponding to the keyframe    
    * @param {Array} rotation       Array of x,y,z-axis rotations of corresponding to the keyframe
    * @param {Array} scale          Array of x,y,z scaling of corresponding to the keyframe
    */
   constructor(time, translation, rotation, scale) {

      this.time = time;                           // time of scene corresponding to key frame (seconds)
      this.translation = translation;             // array of x,y,z translation of corresponding to the keyframe
      this.rotation = rotation;                   // array of x,y,z-axis rotations of corresponding to the keyframe
      this.scale = scale;                         // array of x,y,z scaling of corresponding to the keyframe
   }

   /**
    * @method getNullKeyFrame
	 * Returns a null keyframe. A null keyframe as time=0, no translation, scaling(1,1,1) or rotation
    */
   static getNullKeyFrame() {

      return new KeyFrame(0, [0, 0, 0], [0, 0, 0], [1, 1, 1]); // NULL keyframe corresponds to no change in position or size whatsoever 
   }

   /**
    * @method getTimeMilli
	 * Returns the instance of the keyframe in milliseconds
    */
   getTimeMilli() {
      return this.time * 1000;
   }

   /**
    * @method getMatrix
	 * Calculates and returns the transformation matrix corresponding to the keyframe
    */
   getMatrix() {
      let transfMatrix = mat4.create();

      transfMatrix = mat4.translate(transfMatrix, transfMatrix, this.translation);
      transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, this.rotation[0]);
      transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, this.rotation[1]);
      transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, this.rotation[2]);
      transfMatrix = mat4.scale(transfMatrix, transfMatrix, this.scale);

      return transfMatrix;
   }

}


