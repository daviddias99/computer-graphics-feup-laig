class Piece extends CGFobject {

    constructor(scene, sides, radius, height) {
        super(scene);

        this.radius = radius;
        this.height = height;

        this.prism = new Prism(scene, side);
        this.base = new Poligon(scene, sides);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(this.radius, -1, this.radius);
        this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(this.radius, this.height, this.radius);
        this.prism.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, this.height, 0);
        this.scene.scale(this.radius, 1, this.radius);
        this.scene.popMatrix();
    }
}