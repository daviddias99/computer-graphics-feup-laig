class GameTheme {

    constructor(filename, scene){

        var filename=getUrlVars()['file'] || "./test_scenes/board.xml";
        this.graph = new MySceneGraph(filename,scene);
    }


}