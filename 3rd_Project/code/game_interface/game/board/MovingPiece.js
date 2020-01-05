/**
 * This classe represents a piece of the auxiliary board that differs from the other pieces because it is animated. 
 */
class MovingPiece {

    /**
     * @constructor
     * @param {CGFscene}        scene 
     * @param {CGFobject}       primitive   primtive of the piece
     * @param {number}          player      id of the player
     * @param {array}           pos         position of the piece
     */
    constructor(scene,primitive, player, pos) {
        this.scene = scene;
        this.primitive = primitive;
        this.player = player;
        this.animation = null;
        this.pos = pos;
    }

    /**
     * @method display
     * 
     * Displays the piece, applying the correct animation
     */
    display() {
        
        this.scene.pushMatrix();
        
        this.scene.translate(...this.pos);
        
        // Apply the keyframe animation transformation
        if(this.animation != null){
            this.animation.apply();
        }
        this.scene.rotate(Math.PI / 8, 0, 1, 0);
        
        this.primitive.display(this.player);

        this.scene.popMatrix();
    }
}