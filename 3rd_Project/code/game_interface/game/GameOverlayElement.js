
class GameOverlayElement extends CGFobject{

    /**
     * 
     * @param {XMLScene} scene 
     */
    constructor(scene,buttonID,position){

        super(scene);

        this.buttonID = buttonID;

        this.element = new MyRectangle(scene,"overlay_element",...position);
        
        // Create the texture
        this.elementTex = new CGFtexture(this.scene, 'scenes/images/t_ball_base.jpg');

        // Bind the texture to the sampler "slot" of the shader
        this.elementTex.bind(0);

        // GLSL shader that changes the rectangle so be placed as an overlay and applies the texture 
        this.elementShader = new CGFshader(this.scene.gl, "shaders/overlay_shader.vert", "shaders/ovrlay_shader.frag");
    }

    /**
     * @method setUniformsValues
     * 
     * 
     * @param {Object of Uniform values} obj 
     */
    setUniformsValues(obj){

        this.elementShader.setUniformsValues(obj);
    }

    /**
     *  @method diplay
     * 
     *  
     */
    display(){


        this.scene.setActiveShader(this.elementShader);
        this.scene.gl.disable(this.scene.gl.DEPTH_TEST);
        this.elementTex.bind(0);
        this.element.display();
        this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
        this.scene.setActiveShader(this.scene.defaultShader);

    }

}