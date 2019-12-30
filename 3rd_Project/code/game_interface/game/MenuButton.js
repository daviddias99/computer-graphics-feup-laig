
class MenuButton extends CGFobject{

    /**
     * 
     * @param {XMLScene} scene 
     */
    constructor(scene,buttonID,position){

        super(scene);

        this.buttonID = buttonID;

        // this.button = new MyRectangle(scene,"sec_cam",0.5,1,-1,-0.5);
        this.button = new MyRectangle(scene,"button",...position);
        
        // Create the texture
        this.buttonTex = new CGFtexture(this.scene, 'scenes/images/t_ball_base.jpg');

    }

    /**
     *  @method diplay
     * 
     *  
     */
    display(){


        this.scene.registerForPick(this.scene.pick_id, this);
        this.scene.pick_id++;
        this.button.display();
        this.scene.clearPickRegistration();

    }

}