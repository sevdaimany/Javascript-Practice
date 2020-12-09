class Timer{

    constructor(durationInput, startButton, pauseButton,callbacks){
        this.durationInput = durationInput;
        this.startButton = startButton;
        this.pauseButton = pauseButton;

        if(callbacks){
            this.onStart = callbacks.onStart;
            this.onTick = callbacks.onTick;
            this.onComplete = callbacks.onComplete;
        }

        //set event listener
        this.startButton.addEventListener('click', this.start);
        this.pauseButton.addEventListener('click' , this.pause); 
    }

    //use arrow func for 'this' problem
    start = () => {
        if(this.onStart){
            this.onStart();
        }
        this.tick();
        this.intervalId =  setInterval(this.tick , 1000);
         
    }

    pause = () => {
        clearInterval(this.intervalId ); 
    }

    tick = () => {
        if(this.timeRemaining <= 0){
            if(this.onComplete){
                this.onComplete();
            }
            this.pause();
        }
        else{ 
            this.timeRemaining = this.timeRemaining -1;  
            if(this.onTick){
                this.onTick();
            }
        }
    }

    get timeRemaining(){
        return parseFloat(this.durationInput.value);
    }

    set timeRemaining(time){
        this.durationInput.value = time;  
    }
}


