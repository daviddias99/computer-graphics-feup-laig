/**
 * Class representing a primitive of a game piece (in the case of squex, a octagon or a square)
 */
class PiecePrimitive extends CGFobject {

    /**
     * @constructor
     * 
     * Create a new piece primitive with the given paramters
     * 
     * @param {CGFscene} scene              scene
     * @param {float} radius                piece radius
     * @param {integer} sides               number of slides of the piece  (in squex 4 or 8)
     * @param {float} height                height of the piece
     * @param {array} materials             materials. A piece may have different tiles given the player it is from
     */
    constructor(scene, radius, sides, height, materials) {
        super(scene);

        this.radius = radius;
        this.height = height;
        this.materials = materials;

        this.prism = new Prism(this.scene, sides);
        this.base = new Poligon(this.scene, sides);
    }

    /**
     * @method changeMaterials
     * 
     * Change the materials of the piece
     * @param {Array} materials 
     */
    changeMaterials(materials) {
        this.materials = materials;
    }

    /**
     * @method display
     * 
     * Display the tile with the correct material and size.
     * 
     * @param material_index    material to be applied to the piece (starting at 1).
     */
    display(material_index) {

        this.materials[material_index - 1].apply();

        this.scene.pushMatrix();
        this.scene.scale(this.radius, 1, this.radius);

        // Display top base

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.base.display();
        this.scene.popMatrix();

        // Display side

        this.scene.pushMatrix();
        this.scene.scale(1, this.height, 1);
        this.prism.display();
        this.scene.popMatrix();

        // Display bottom base

        this.scene.pushMatrix();
        this.scene.translate(0, this.height, 0);
        this.base.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}