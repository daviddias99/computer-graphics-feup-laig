class GameMenu extends GameTheme {

    constructor(scene, orchestrator) {
        super('menu.xml', scene, orchestrator);
    }

    initInterface() {
        let gui = this.scene.interface.gui;

        this.boardFolder = gui.addFolder('Board');
        this.boardFolder.add(this.orchestrator, 'boardHeight', 4, 14).name('Height').step(1);
        this.boardFolder.add(this.orchestrator, 'boardWidth', 4, 14).name('Width').step(1);
        this.boardFolder.open();

        this.playerFolder = gui.addFolder('Player');
        this.playerFolder.add(this.orchestrator, 'player1', {'Human': 'P', 'Computer Lv1': 1, 'Computer Lv2': 2}).name('Player 1');
        this.playerFolder.add(this.orchestrator, 'player2', {'Human': 'P', 'Computer Lv1': 1, 'Computer Lv2': 2}).name('Player 2');
        this.playerFolder.open();
    }

    destroyInterface() {
        let gui = this.scene.interface.gui;

        gui.removeFolder(this.boardFolder);
        gui.removeFolder(this.playerFolder);
    }

    onGraphLoaded() {
        super.onGraphLoaded();
        // this.scene.interface.setActiveCamera();
        this.initInterface();

    }

}