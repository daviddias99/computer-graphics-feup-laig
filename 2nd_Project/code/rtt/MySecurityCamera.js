class MySecurityCamera extends CGFobject{

    constructor(scene,screenW, screenH){

        super(scene);
        // this.screen = new MyRectangle(scene,0,screenW,screenW*0.25,-screenH*0.25,-screenH);
        this.screen = new MyRectangle(scene,"sec_cam",0.5,1,-1,-0.5);
        // this.screen = new MyRectangle(scene,"sec_cam",0,1,0,1);
        // this.screen = new MyRectangle(scene,0,-1,1,-0.75,-1);
    }

    display(){

        this.screen.display();
    }

}