
class MenuButton extends CGFobject{

    /**
     * 
     * @param {XMLScene} scene 
     */
    constructor(scene,position){

        super(scene);

        // this.button = new MyRectangle(scene,"sec_cam",0.5,1,-1,-0.5);
        this.button = new MyRectangle(scene,"sec_cam",...position);
        
        // Create the texture
        this.buttonTex = new CGFtexture(this.scene, 'scenes/images/t_ball_base.jpg');

        // Bind the texture to the sampler "slot" of the shader
        this.buttonTex.bind(0);

        // GLSL shader that changes the rectangle so be placed as an overlay and applies the texture 
        this.buttonShader = new CGFshader(this.scene.gl, "shaders/button_shader.vert", "shaders/button_shader.frag");
    }

    /**
     * @method setUniformsValues
     * 
     * 
     * @param {Object of Uniform values} obj 
     */
    setUniformsValues(obj){

        this.buttonShader.setUniformsValues(obj);
    }
    
    /**
     *  @method reload
     * 
     */
    reload(){
        this.buttonTex = new CGFtextureRTT(this.scene, this.scene.gl.canvas.width, this.scene.gl.canvas.height);
        this.buttonTex.bind(0);   
    }

    /**
     *  @method diplay
     * 
     *  
     */
    display(){

        // this.scene.setActiveShader(this.buttonShader);
        this.scene.gl.disable(this.scene.gl.DEPTH_TEST);
        this.buttonTex.bind(0);

        this.scene.registerForPick(this.scene.pick_id, this);
        this.scene.pick_id++;
        this.button.display();
        this.scene.clearPickRegistration();

        this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
        // this.scene.setActiveShader(this.scene.defaultShader);

    }

}