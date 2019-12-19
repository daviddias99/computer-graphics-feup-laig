class TilePrimitive extends CGFobject {

    constructor(scene, radius, sides, material) {
        super(scene);

        this.radius = radius;
        this.sides = sides;
        this.material = material;

        this.tile = new Poligon(this.scene, this.sides);
    }

    getRadius() {
        return this.radius;
    }

    display() {
        this.material.apply();

        this.scene.pushMatrix();
        this.scene.scale(this.radius, 1, this.radius);

        if (this.sides == 8)
            this.tile.display();
        else
            this.tile.display();

        this.scene.popMatrix();
    }
}