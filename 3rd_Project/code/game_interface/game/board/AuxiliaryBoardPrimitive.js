class AuxiliaryBoardPrimitive{

    constructor(scene,rows,boardPrimitive,type,material){

        this.scene = scene;
        this.aux_board_primitive_side = new Prism(this.scene, 4);
        this.aux_board_primitive_top = new MyPlane(this.scene, 10, 10);
        this.boardPrimitive = boardPrimitive;
        this.arr = this.boardPrimitive.getAuxBoardDisplayParameters();
        this.type = type;
        this.material = material;
        
        if(type == -1){
            this.addition = 0;
        }
        else {
            this.addition = rows - 1;
        }
    }

    changeMaterials(material) {
        this.material = material;
    }

    display(){

        let auxBoardPosition = [0,this.boardPrimitive.board_height/2, this.arr[0] + (this.type * 1.37 + this.addition) * this.arr[1]];

        this.material.apply();
        this.scene.pushMatrix();        

        this.scene.pushMatrix();  
        this.scene.translate(...auxBoardPosition);
        this.scene.scale(...this.arr[2]);
        this.scene.translate(0.5,0,0);

        this.scene.pushMatrix();
        this.scene.translate(0.0,this.boardPrimitive.board_height/2,0);
        this.aux_board_primitive_top.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0.0,-this.boardPrimitive.board_height/2,0);
        this.scene.rotate(Math.PI,1,0,0);
        this.aux_board_primitive_top.display()
        this.scene.popMatrix();
        
        this.scene.translate(0.0, -this.boardPrimitive.board_height/2,0);
        this.scene.rotate(Math.PI / 4.0, 0.0, 1.0, 0.0);
        this.scene.scale(Math.sqrt(0.5), this.boardPrimitive.board_height, Math.sqrt(0.5));
        this.aux_board_primitive_side.display();
        this.scene.popMatrix();
        this.scene.popMatrix();
    }
}