//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 
//Include additional files here
serialInclude([ './../lib/CGF.js', 
                'XMLscene.js', 
                'MySceneGraph.js', 
                'MyInterface.js',
                './primitives/MyPrimitive.js', 
                './primitives/MyRectangle.js', 
                './primitives/MyCylinder.js', 
                './primitives/MyTriangle.js',
                './primitives/MySphere.js',
                './primitives/MyTorus.js',
                './primitives/nurbs/MyPatch.js',
                './primitives/nurbs/MyPlane.js',
                './primitives/nurbs/MyCylinder2.js',
                './rtt/MySecurityCamera.js',
                './animation/Animation.js',
                './animation/KeyFrame.js',
                './animation/KeyFrameAnimation.js',
                './animation/Segment.js', 
                './animation/QuadraticKfGenerator.js', 
                './MySceneComponent.js',

                './primitives/Poligon.js',
                './primitives/Prism.js',


                './game/GameState.js',
                './game/GameOrchestrator.js',
                './game/GameSequence.js',
                './game/GameTheme.js',
                './game/GameOverlayElement.js',
                './game/OverlayTimer.js',
                './game/OverlayGameOver.js',
                './game/OverlayScoreboard.js',
                './game/GameMenu.js',
                './game/PrologInterface.js',
                './game/PrologMessage.js',
                './game/Move.js',
                './game/board/AuxiliaryBoards.js',
                './game/board/Board.js',
                './game/board/Piece.js',
                './game/board/Tile.js',
                './game/board/BoardPrimitive.js',
                './game/board/PiecePrimitive.js',
                './game/board/TilePrimitive.js',
                './game/board/AuxiliaryBoardPrimitive.js',
                './game/board/MovingPiece.js',

                'misc_functions.js',



main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
	
    var filename=getUrlVars()['file'] || "./test_scenes/board.xml";

	// create and load graph, and associate it to scene. 
	// Check console for loading errors
    // var myGraph = new MySceneGraph(filename, myScene);
    // let myOrchestrator = new GameOrchestrator(myScene);
	
	// start
    app.run();
}

]);