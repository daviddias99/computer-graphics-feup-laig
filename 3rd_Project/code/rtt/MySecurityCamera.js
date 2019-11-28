/**
 *  Class that implements a security camera of the scene using render-to-texture
 */
class MySecurityCamera extends CGFobject{

    /**
     * Create the security camera, it's texture and it's shader.
     * @param {XMLScene} scene 
     */
    constructor(scene){

        super(scene);

        // The rectangle is the object where the security texture will be placed. It's dimensions allow it to sit at the bottom right corner of the screen, occupying 25% of the screen
        // in both direction
        this.screen = new MyRectangle(scene,"sec_cam",0.5,1,-1,-0.5);
        
        // Create the RTT texture that will contain a "snapshot" of the scene from the perspective of the security camera
        this.cameraTex = new CGFtextureRTT(this.scene, this.scene.gl.canvas.width, this.scene.gl.canvas.height);

        // Bind the texture to the sampler "slot" of the shader
        this.cameraTex.bind(0);

        // GLSL shader that changes the rectangle so be placed as an overlay and applies  the texture and post-processing efects
        this.cameraScreenShader = new CGFshader(this.scene.gl, "shaders/camera_shader.vert", "shaders/camera_shader.frag");
    }

    /**
     * @method attachToFrameBuffer
     * 
     * Wrapper function that attaches the camera texture to the frame buffer. This way the next time the scene is rendered it will be rendered to the texture.
     */
    attachToFrameBuffer(){
        this.cameraTex.attachToFrameBuffer();
    }

    /**
     * @method detachFromFrameBuffer
     * 
     * Wrapper function that detaches the camera texture to the frame buffer. This way the next time the scene is rendered it will be rendered to the screen.
     */
    detachFromFrameBuffer(){
        this.cameraTex.detachFromFrameBuffer();
    }

    /**
     * @method setUniformsValues
     * 
     *  Wrapper function that updates the security camera shader's uniform values
     * @param {Object of Uniform values} obj 
     */
    setUniformsValues(obj){

        this.cameraScreenShader.setUniformsValues(obj);
    }
    
    /**
     *  @method reload
     * 
     *  Create the rtt texture again. This function is meant to be used as an handler for the window resize event in order to update the securitu camera
     *  in case the window resizes.
     */
    reload(){
        this.cameraTex = new CGFtextureRTT(this.scene, this.scene.gl.canvas.width, this.scene.gl.canvas.height);
        this.cameraTex.bind(0);   
    }

    /**
     *  @method diplay
     * 
     *  Display the security camera
     */
    display(){

        // Display the security camera screen

        this.scene.setActiveShader(this.cameraScreenShader);
        this.scene.gl.disable(this.scene.gl.DEPTH_TEST);
        this.cameraTex.bind(0);

        this.screen.display();

        this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
        this.scene.setActiveShader(this.scene.defaultShader);

    }

}