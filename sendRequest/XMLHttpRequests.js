const req = new XMLHttpRequest();
req.addEventListener('load' , function(){
    console.log('FIRST REQUEST WORKED!!');
    const data  = JSON.parse(this.responseText);
    const filmURL = data.results[0].films[0];
    const filmReq = new XMLHttpRequest();
    filmReq.addEventListener('load', function(){
        console.log('SECOND REQUEST WORKED!!');
        const filmData = JSON.parse(this.responseText);
        console.log(filmData.title);
    });
    filmReq.addEventListener('error' , function(e){
        console.log("ERROR!" , e);
    });
    filmReq.open('GET', filmURL);
    filmReq.send();

});
req.addEventListener('error',(e) =>{
    console.log('ERROR!!');
});
req.open("GET" , 'https://swapi.dev/api/planets/');
req.send();
