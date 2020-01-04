class GameOverlayElement extends CGFobject{

    /**
     * 
     * @param {XMLScene} scene 
     */
    constructor(scene, position, texture){
        super(scene);

        this.element = new MyRectangle(scene,"overlay_element",...position);
        
        this.changeTexture(texture);

        // GLSL shader that changes the rectangle so be placed as an overlay and applies the texture 
        // this.elementShader = new CGFshader(this.scene.gl, 'shaders/overlay_shader.vert', 'shaders/overlay_shader.frag');
    }

    changeTexture(texture) {
        this.elementTex = texture;
    }

    display(){
        // this.scene.gl.disable(this.scene.gl.DEPTH_TEST);
        // this.scene.setActiveShader(this.elementShader);
        this.elementTex.bind(0);
        this.element.display();
        // this.scene.setActiveShader(this.scene.defaultShader);
        // this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
    }

}