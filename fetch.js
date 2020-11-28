fetch('https://swapi.dev/api/planets/')
.then((response) =>{
    if(!response.ok)
        throw new Error(`status code error : ${response.status}`);
    
    return response.json();
})
.then((data) => {
    console.log('FETCH ALL PLANETS (first 10)');
    const filmURL = data.results[0].films[0];
    return  fetch(filmURL);
})
.then((response) => {
    if(!response.ok)
        throw new Error(`Status Code Error: ${response.status}`);
    return response.json();
})
.then((data) =>{
    console.log('FETCHED FIRST FILM, based off of first planet');
    console.log(data.title);

})
.catch((err) =>{
    console.log('SOMETHING WENT WRONG WITH FETCH!');
    console.log(err);
});
