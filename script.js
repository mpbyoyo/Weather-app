// We know API keys are supposed to be hidden by a server, but we don't have a server, and this is... probably fine? So it's here.
const apiInfo = {
  base: `https://api.openweathermap.org/data/2.5/weather?`,
  key: `7ad6e022b1a588d3eb4a98d0707aafa7`
}

const city = document.querySelector('#city')
const hiLow = document.querySelector('#hi-low')
const startTemp = document.querySelector('#start-temp')
const humidity = document.querySelector('#humidity')
const feelsLike = document.querySelector('#feels-like')
const weather = document.querySelector('#weather')
const date = document.querySelector('#date')
const time = document.querySelector('#time')
const weatherIcon = document.querySelector('#weather-icon')
const dropDown = document.querySelector('#temp-dropdown')

const makeDate = () => {
  let newDate = `${new Date()}`.split(' ')
  newDate.splice(0, 1)
  newDate.splice(3, 5)
  const result = newDate.join(' ')
  return result
}


// I had to use jquery to get a cool smooth animation ;-; sorry
let lazyPatch = 0
$("#temp-dropper").click(function () {
  if (lazyPatch == 0) {
    $('#temp-dropper').animate({"margin-left": '+=220'}).css('transform', 'rotate(90deg)');
    $('#temp-dropdown').animate({"margin-left": '+=210'}).fadeIn('10');
    lazyPatch += 1
  } else {
    $('#temp-dropper').animate({"margin-left": '-=220'}).css('transform', 'rotate(270deg)');
    $('#temp-dropdown').fadeOut('10').animate({"margin-left": '-=210'});
    lazyPatch -= 1
  }
});

const searchBox = document.querySelector('.search-box')
searchBox.addEventListener('keypress', setQuery)

const searchButton = document.querySelector('#search-button')
searchButton.addEventListener('click', setQueryOther)

function setQuery(e) {
  if(e.keyCode === 13) {
    if (searchBox.value) {
      getResults(searchBox.value)
    } else {
      alert('Please enter a city into the search bar!')
    }
  }
}


function setQueryOther(e) {
  if (searchBox.value) {
    getResults(searchBox.value)
  } else {
    alert('Please enter a city into the search bar!')
  }
}


const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(loadPos)
  } else {
    alert('Unable to reach user location! (Browser not compatible with geolocation).')
  }
}

const loadPos = (pos) => {
  console.log(pos)
    fetch(`${apiInfo.base}lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${apiInfo.key}&units=imperial`)
      .then(resp => resp.json())
      .then(data => displayResults(data))
  }


function getResults(city) {
    fetch(`${apiInfo.base}q=${city}&units=imperial&APPID=${apiInfo.key}`)
    .then(resp => resp.json())
    .then(data => displayResults(data));
}


function displayResults(results) {
  if (!results.sys) {
    alert(`${results.message}`)
  } else {
    city.innerText = `${results.name}, ${results.sys.country}`

    
      
    hiLow.innerText = `High/Low: ${Math.floor(results.main.temp_min)}°F / ${Math.floor(results.main.temp_max)}°F`
    startTemp.innerText = `${Math.floor(results.main.temp)}°F`
    feelsLike.innerText = `Feels-like: ${Math.floor(results.main.feels_like)}°F`
    humidity.innerText = `Humidity: ${results.main.humidity}%`
    weather.innerText = (results.weather[`0`].description).replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
    date.innerText = makeDate()
    if (results.weather['0'].main == 'Clouds') {
      weatherIcon.src = 'https://cdn-icons-png.flaticon.com/512/0/74.png'
    } else if (results.weather['0'].main ==   'Clear') {
      weatherIcon.src = 'https://cdn1.iconfinder.com/data/icons/weather-18/512/sunny_clear_blu_sky-512.png'
    }
  }
}

  getLocation()


  // for each, day of the week