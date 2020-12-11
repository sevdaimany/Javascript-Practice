const fetchData = async (searchTerm) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '4b54412e',
      s: searchTerm,
    }, 
  });

  console.log(response.data);
};
const input = document.querySelector("input");

const onInput = (event)=> {
  if(timeoutId){
    clearTimeout(timeoutId);
  }
   timeoutId = setTimeout( () => {
        fetchData(event.target.value);
    }, 1000);
}
input.addEventListener('input' , onInput);