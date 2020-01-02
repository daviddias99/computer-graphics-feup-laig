class BoardPrimitive {


    constructor(scene,cols,rows,primitives,boardMaterials){

        this.scene = scene;
        this.primitives = primitives;
        this.outer_board = new Prism(this.scene, 4);
        this.plane = new MyPlane(this.scene, 10, 10);
        this.boardMaterials = boardMaterials;
        this.cols = cols;
        this.rows = rows;

        this.init();
    }

    init(){

        let oct_radius = this.primitives[0].getRadius();
        let sqr_radius = this.primitives[2].getRadius();

        let oct_diagonal = oct_radius * Math.cos(Math.PI / 8.0) * 2.0;

        let spacing = oct_radius * 0.025;
        this.oct_pos = sqr_radius + oct_diagonal / 2.0 + spacing;
        this.sqr_pos = sqr_radius + spacing / 2.0;
        this.delta = oct_diagonal + spacing;

        this.board_height = 0.1;
        this.board_scaling = [this.cols * oct_diagonal + 2 * sqr_radius + spacing * (this.cols - 1) * 2,1.0,this.rows * oct_diagonal + 2 * sqr_radius + spacing * (this.rows - 1) * 2];
        this.board_scale = this.board_scaling[0] >= this.board_scaling[2] ? 1 / this.board_scaling[0] : 1 / this.board_scaling[2];
        this.aux_board_scaling = [this.cols * oct_diagonal + 2 * sqr_radius + spacing * (this.cols - 1) * 2,1.0,oct_diagonal + 0.5 * sqr_radius + spacing];

        this.board_rotation = Math.PI / 4.0;

    }

    getAuxBoardDisplayParameters(){

        return  [this.oct_pos, this.delta, this.aux_board_scaling];
    }

    getPosition(j,i,height,type){


        if(type =="octagon"){

            return [this.oct_pos + j * this.delta, this.board_height + 0.01 + height * this.primitives[1].height, this.oct_pos + i * this.delta];
        }
        else{

            return [this.sqr_pos + j * this.delta, this.board_height + 0.01, this.sqr_pos + i * this.delta];
        }
    }

    display(){

        this.scene.pushMatrix();
        this.scene.scale(this.board_scale, this.board_scale, this.board_scale);

        this.scene.pushMatrix();
        this.scene.scale(...this.board_scaling);
        this.scene.translate(0.5, this.board_height, 0.5);
        this.boardMaterials[0].apply();
        this.plane.display();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI,1,0,0);
        this.scene.translate(0, this.board_height, 0);
        this.plane.display()
        this.scene.popMatrix();

        this.scene.translate(0.0, -this.board_height, 0.0);
        this.scene.rotate(this.board_rotation, 0.0, 1.0, 0.0);
        this.scene.scale(Math.sqrt(0.5), this.board_height, Math.sqrt(0.5));
        this.outer_board.display();
        this.scene.popMatrix();
        
    }
}