class GameAlarm {


    constructor(){

        this.lastT = 0;
        this.observers = [];
        this.currentMinutes = 0;
        this.currentSeconds = 0;
        this.timerStart = null;

    }

    resetTime(){
        this.timerStart = this.lastT;
        this.currentMinutes = 0;
        this.currentSeconds = 0;
    }

    setAlarm(time,callback){

        this.observers.push([this.lastT,time,callback,false]);
    }

    updateTimer(time,timeChangeCallback){

        if(!this.timerStart)
            return;

        
        let ellapsedTime = time - this.timerStart;
        let ellapsedSeconds = ellapsedTime/1000;
        let currentMinutes = Math.floor(ellapsedSeconds/60);
        let currentSeconds = Math.floor(ellapsedSeconds % 60);

        if(timeChangeCallback){

            if(this.currentMinutes != currentMinutes || this.currentSeconds != currentSeconds){

                timeChangeCallback([currentMinutes,currentSeconds]);
            }
        }

        this.currentMinutes = currentMinutes;
        this.currentSeconds = currentSeconds;

    }

    update(time,callback){

        this.updateTimer(time,callback);
        this.lastT = time;

        for(let i = 0; i < this.observers.length; i++){

            if(this.lastT - this.observers[i][0] >= this.observers[i][1] * 1000){

                this.observers[i][2]();
                this.observers.splice(i,1);
                i--;
            }
        }
    }

    getTime(){

        return [this.currentMinutes,this.currentSeconds];
    }

}