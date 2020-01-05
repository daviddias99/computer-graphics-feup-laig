/**
 * Class representing a primitive of a game tile (in the case of squex, a octagon or a square)
 */
class TilePrimitive extends CGFobject {

    /**
     * @constructor
     * 
     * Create a new tile primitive with the given parameters
     * 
     * @param {CGFscene} scene                  scene             
     * @param {float} radius                    radius of the tile
     * @param {Integer} sides                   number of tiles of the tile (in squex 4 or 8)
     * @param {CGFappearence} material          material to be applied to the tile
     */
    constructor(scene, radius, sides, material) {
        super(scene);

        this.radius = radius;
        this.sides = sides;
        this.material = material;
        this.tile = new Poligon(this.scene, this.sides);
    }

    /**
     * @method changeMaterials
     * 
     * Change the material of the tile to a new one
     * @param {CGFappearence} material 
     */
    changeMaterials(material) {
        this.material = material;
    }

    /**
     * @method getRadius
     * 
     * Get the radius of the tile
     */
    getRadius() {
        return this.radius;
    }

    /**
     * @method display
     * 
     * Display the tile with the correct material and size.
     */
    display() {
        this.material.apply();

        this.scene.pushMatrix();
        this.scene.scale(this.radius, 1, this.radius);

        this.tile.display();

        this.scene.popMatrix();
    }
}