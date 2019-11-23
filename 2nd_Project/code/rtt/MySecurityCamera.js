class MySecurityCamera extends CGFobject{

    constructor(scene){

        super(scene);
        this.screen = new MyRectangle(scene,"sec_cam",0.5,1,-1,-0.5);
    }

    display(){

        this.screen.display();
    }

}