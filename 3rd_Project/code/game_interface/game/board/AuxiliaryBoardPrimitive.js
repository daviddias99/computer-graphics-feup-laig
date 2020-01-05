/**
 * Class that represents the auxiliary-board casing. 
 */
class AuxiliaryBoardPrimitive {

    /**
     * @constructor
     * 
     * @param {CGFscene}            scene           scene
     * @param {number}              rows            number of rows of the board
     * @param {BoardPrimitive}      boardPrimitive  used for getting location information
     * @param {number}              type            -1 if player 1, 1 if player 2         
     * @param {material}            material        material used in the auxiliary board
     */
    constructor(scene, rows, boardPrimitive, type, material) {

        this.scene = scene;
        this.aux_board_primitive_side = new Prism(this.scene, 4);
        this.aux_board_primitive_top = new MyPlane(this.scene, 10, 10);
        this.boardPrimitive = boardPrimitive;
        this.displayParameters = this.boardPrimitive.getAuxBoardDisplayParameters();
        this.type = type;
        this.material = material;

        if (type == -1) {
            this.addition = 0;
        }
        else {
            this.addition = rows - 1;
        }
    }

    /**
    * @method changeMaterials
    * 
    * Change the material of the auxiliary board casing
    * @param {CGFappearance} material 
    */
    changeMaterials(material) {
        this.material = material;
    }

    /**
     * @method display
     * 
     * Display the auxiliary board casing
     */
    display() {

        let auxBoardPosition = [0, this.boardPrimitive.board_height / 2, this.displayParameters[0] + (this.type * 1.37 + this.addition) * this.displayParameters[1]];

        this.material.apply();
        this.scene.pushMatrix();

        this.scene.pushMatrix();

        // Scale and position the aux board
        this.scene.translate(...auxBoardPosition);
        this.scene.scale(...this.displayParameters[2]);
        this.scene.translate(0.5, 0, 0);

        // Display the top of the aux board

        this.scene.pushMatrix();
        this.scene.translate(0.0, this.boardPrimitive.board_height / 2, 0);
        this.aux_board_primitive_top.display();
        this.scene.popMatrix();

        // Display the bottom of the aux board
        this.scene.pushMatrix();
        this.scene.translate(0.0, -this.boardPrimitive.board_height / 2, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.aux_board_primitive_top.display()
        this.scene.popMatrix();

        // Display the sides the aux board
        this.scene.translate(0.0, -this.boardPrimitive.board_height / 2, 0);
        this.scene.rotate(Math.PI / 4.0, 0.0, 1.0, 0.0);
        this.scene.scale(Math.sqrt(0.5), this.boardPrimitive.board_height, Math.sqrt(0.5));
        this.aux_board_primitive_side.display();
        this.scene.popMatrix();
        this.scene.popMatrix();
    }
}