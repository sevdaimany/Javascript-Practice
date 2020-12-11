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

 
const onInput = (event) => {
        fetchData(event.target.value,500);
};

input.addEventListener('input' ,debounce(onInput, 500));