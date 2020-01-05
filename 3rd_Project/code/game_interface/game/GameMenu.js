/**
 * GameMenu is a child class of GameTheme as it is also loaded through a XMl but a game cannot be played in it. Also, it as menu options on the dat.gui interface and 
 * object interface that are not available in GameTheme.
 */
class GameMenu extends GameTheme {

    constructor(scene, orchestrator) {
        super('menu.xml', scene, orchestrator);
    }

    /**
     * @method initInterface
     * 
     * Add the board size and player type choosing to the dat.gui interface
     */
    initInterface() {
        let gui = this.scene.interface.gui;

        const MINBOARDSIZE = 4;
        const MAXBOARDSIZE = 14;

        this.boardFolder = gui.addFolder('Board');
        this.boardFolder.add(this.orchestrator, 'boardHeight', MINBOARDSIZE, MAXBOARDSIZE).name('Height').step(1);
        this.boardFolder.add(this.orchestrator, 'boardWidth', MINBOARDSIZE, MAXBOARDSIZE).name('Width').step(1);
        this.boardFolder.open();

        this.playerFolder = gui.addFolder('Player');
        this.playerFolder.add(this.orchestrator, 'player1', {'Human': 'P', 'Computer Lv1': 1, 'Computer Lv2': 2}).name('Player 1');
        this.playerFolder.add(this.orchestrator, 'player2', {'Human': 'P', 'Computer Lv1': 1, 'Computer Lv2': 2}).name('Player 2');
        this.playerFolder.open();
    }

    /**
     * @method destroyInterface
     * 
     * Remove the board size and player type interface from dat.gui
     */
    destroyInterface() {
        let gui = this.scene.interface.gui;

        gui.removeFolder(this.boardFolder);
        gui.removeFolder(this.playerFolder);
    }


    /**
     * @method onGraphLoaded
     * 
     * Same as game theme's on graph loaded but adds extra interface elements.
     */
    onGraphLoaded() {
        super.onGraphLoaded();
        this.scene.interface.setActiveCamera();
        this.initInterface();
        this.cameraState = 'menu';
    }

}