class PiecePrimitive extends CGFobject {

    constructor(scene, radius, sides, height, materials) {
        super(scene);

        this.radius = radius;
        this.height = height;
        this.materials = materials;

        this.prism = new Prism(this.scene, sides);
        this.base = new Poligon(this.scene, sides);
    }

    display(material_index) {
        this.materials[material_index].apply();
        
        this.scene.pushMatrix();
        this.scene.scale(this.radius, 1, this.radius);

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

        this.scene.popMatrix();
    }
}