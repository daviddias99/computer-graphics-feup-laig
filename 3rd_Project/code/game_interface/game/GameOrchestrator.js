class GameOrchestrator {

    constructor(scene){
        // TODO: remove from here
        this.sqr = new CGFappearance(scene);
        this.sqr.setAmbient(0.0, 0.1, 0.0, 1);
        this.sqr.setDiffuse(0.0, 0.9, 0.0, 1);
        this.sqr.setSpecular(0.0, 0.1, 0.0, 1);
        this.sqr.setShininess(10.0);

        this.oct = new CGFappearance(scene);
        this.oct.setAmbient(0.1, 0.0, 0.0, 1);
        this.oct.setDiffuse(0.9, 0.0, 0.0, 1);
        this.oct.setSpecular(0.1, 0.0, 0.0, 1);
        this.oct.setShininess(10.0);


        let oct_radius = 0.2;
        let sqr_radius = Math.sqrt(Math.pow(oct_radius * Math.sin(Math.PI / 8.0) * 2.0, 2) / 2.0);

        let primitives = [
            new TilePrimitive(scene, oct_radius, 8, this.oct),          // octogonal tile
            new PiecePrimitive(scene, oct_radius, 8, 0.05, this.oct),   // octogonal piece
            new TilePrimitive(scene, sqr_radius, 4, this.sqr),          // square tile
            new PiecePrimitive(scene, sqr_radius, 4, 0.05, this.sqr)    // square piece
        ];

        this.board = new Board(scene, primitives, 4, 4);
        // to here

        this.theme = new GameTheme(null,scene);

    }

    update(time) {

    }

    display() {

     this.theme.display();
     this.board.display();
     
    }
    
}