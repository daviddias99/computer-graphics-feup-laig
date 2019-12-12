class Piece extends CGFobject {

    constructor(scene, sides, material) {
        super(scene);
        this.material = material;
        this.height = 0.015;
        this.prism = new Prism(scene, sides);
        this.base = new Poligon(scene, sides);
    }

    display() {
        this.material.apply();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(1, this.height, 1);
        this.prism.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, this.height, 0);
        this.base.display();
        this.scene.popMatrix();
    }
}