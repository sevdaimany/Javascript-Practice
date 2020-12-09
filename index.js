class Timer{

    constructor(durationInput, startButton, pauseButton){
        this.durationInput = durationInput;
        this.startButton = startButton;
        this.pauseButton = pauseButton;

        //set event listener

        this.startButton.addEventListener('click', this.start);
        this.pauseButton.addEventListener('click' , this.pause); 
    }

    //use arrow func for 'this' problem
    start = () => {
        this.tick();
        this.intervalId =  setInterval(this.tick , 1000);
         
    }

    pause = () => {
        clearInterval(this.intervalId); 
    }

    tick = () => {
        console.log('tick');
    }
}


const durationInput = document.querySelector('#duration');
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");

const timer = new Timer(durationInput , startButton , pauseButton); 