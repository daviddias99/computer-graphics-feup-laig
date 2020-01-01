class GameAlarm {


    constructor(){

        this.lastT = 0;
        this.observers = [];

    }


    setAlarm(time,callback){

        this.observers.push([this.lastT,time,callback,false]);
    }

    update(time){

        this.lastT = time;

        for(let i = 0; i < this.observers.length; i++){

            if(this.lastT - this.observers[i][0] >= this.observers[i][1] * 1000){

                this.observers[i][2]();
                this.observers.splice(i,1);
                i--;
            }
        }



    }

}