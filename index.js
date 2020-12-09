class Timer{

    constructor(durationInput, startButton, pauseButton){
        this.durationInput = durationInput;
        this.startButton = startButton;
        this.pauseButton = pauseButton;

        //set event listener

        this.startButton.addEventListener('click', this.start);
    }

    //use arrow func for 'this' problem
    start = () => {
        console.log(this);
    }

    tick = () => {
        console.log('tick');
    }
}


const durationInput = document.querySelector('#duration');
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");

const timer = new Timer(durationInput , startButton , pauseButton);