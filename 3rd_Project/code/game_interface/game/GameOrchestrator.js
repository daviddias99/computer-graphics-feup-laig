class GameOrchestrator {

    constructor(){
        
    }

    update(time) {
        this.animator.update(time);
    }

    display() {

     this.theme.display();
     this.gameboard.display();
     
    }
    
}