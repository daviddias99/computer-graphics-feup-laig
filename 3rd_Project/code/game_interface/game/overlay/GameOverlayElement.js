/**
 * Class that represents an overlay element
 */
class GameOverlayElement extends CGFobject{

    /**
     * @constructor                 GameOverlayElement constructor
     * @param {XMLScene} scene      Reference to the scene in which the overlay will be displayed
     * @param {Array} position      Positioning of the overlay
     * @param {CGFtexture} texture  Texture that will be applied to the object
     */
    constructor(scene, position, texture){
        super(scene);
        this.elementTex = texture;
        this.element = new MyRectangle(scene,"overlay_element",...position);
    }

    /**
     * @method changeTexture
     * @param {CGFtexture} texture 
     * 
     * Change the texture that will be applied to the object
     */
    changeTexture(texture) {
        this.elementTex = texture;
    }

    /**
     * @method display
     * 
     * Display the object
     */
    display() {
        this.elementTex.bind(0);
        this.element.display();
    }

}