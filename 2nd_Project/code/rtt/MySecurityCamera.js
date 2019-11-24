
class MySecurityCamera extends CGFobject{

    constructor(scene){

        super(scene);
        this.screen = new MyRectangle(scene,"sec_cam",0.5,1,-1,-0.5);
        this.cameraTex = new CGFtextureRTT(this.scene, this.scene.gl.canvas.width, this.scene.gl.canvas.height);
        this.cameraTex.bind(0);

        this.cameraScreenShader = new CGFshader(this.scene.gl, "shaders/camera_shader.vert", "shaders/camera_shader.frag");
    }

    attachToFrameBuffer(){
        this.cameraTex.attachToFrameBuffer();
    }

    detachFromFrameBuffer(){
        this.cameraTex.detachFromFrameBuffer();
    }

    setUniformsValues(obj){

        this.cameraScreenShader.setUniformsValues(obj);
    }
    
    reload(){
        this.cameraTex = new CGFtextureRTT(this.scene, this.scene.gl.canvas.width, this.scene.gl.canvas.height);
        this.cameraTex.bind(0);   
    }

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