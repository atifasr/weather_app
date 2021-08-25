


window.onload = (e)=>{
    e.preventDefault()
    
    const AccessToken = key
    
    let searchButton = document.querySelector('.search')



    // get position coordinates 
    const get_location = (call_back)=>{
        if (navigator.geolocation){
            console.log('works')
            navigator.geolocation.getCurrentPosition((position)=>{
                console.log(position)
                let lat = position.coords.latitude
                call_back(position.coords.longitude,position.coords.latitude)
            })
         
            
        }   
    }  

    const ge_posiCoordinates = (longi,lati) =>{
        console.log('longitude->',longi,'latitiude->',lati)
        // calling fetch weather from here because of call_back pattern 

        let url_reverse = `https://us1.locationiq.com/v1/reverse.php?key=${AccessToken}&lat=${lati}&lon=${longi}&format=json`
        
        
        // fetch_city(url_reverse)
    }

    // for fetching city details using reverse geocoding 
    const fetch_city = async (url_reverse)=>{
        const response = await fetch(url_reverse,{
            method:'GET'
        })
        const data = await response.json()
        console.log('City name using coordinates ',data)
        console.log(data.address.city)
        fetchWeather(data.address.city)
    }

    


    get_location(ge_posiCoordinates);
   
    


    const fetchWeather = (cityname)=>{

        let loc = document.querySelector('.location').value
        let city = document.querySelector('.city').value
        let state_code = document.querySelector('.state_code').value
        let temperature_block = document.querySelector('.temp_cel')
        let max_temp = document.querySelector('.max_temp')
        let city_name = cityname
        
        let logo_weather = document.querySelector('.curr_weather')
        let country_code = '+91'
        let count = 7
        let forecastRow = document.querySelector('.forcast')
       

        state_code = parseInt(state_code)
        console.log(loc , city)
        const key = open_weatherApikey
        

    
        let url_current = new Request(`http://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${key}`)
        let url = new Request(`http://api.openweathermap.org/data/2.5/forecast?q=${city_name},${state_code},${country_code}&appid=${key}`)
        // non blocking async function 
        const WeatherFetch = async () =>{
            try{
                let response = await fetch(url_current,{
                    method:'GET'
                })
                let current_weather = await response.json()
                console.log(current_weather)
                response = await fetch(url,{
                    method : 'GET',
                    })
                const data = await response.json()
                console.log(data)
                
                
                // function for current weather
                currentWeather(current_weather,temperature_block,logo_weather,max_temp)
                // function for forecast weather
                foreCastWeather(data,forecastRow)


            }
            catch(e){
                console.log(e)
                // alert('City not found')
            }
        }
    
        WeatherFetch()

    } 



      
    fetchWeather('srinagar')  
   















   
    searchButton.addEventListener('click',function(e){
        e.preventDefault()
        fetchWeather()
    }
    
    )
    console.log('not blocking API request')

}





const currentWeather = (current_weather,temperature_block,logo_weather,max_temp) =>{
    let sun_set = document.querySelector('.sun_set')
    let sun_rise = document.querySelector('.sun_rise')

    const temperature = temperatureConverter(current_weather.main.temp).toFixed(2)
    
            temperature_block.innerHTML = 'Current temperature is '+ temperature+ ' Humidity '+current_weather.main.humidity + ' <small>' + current_weather.weather[0].description +'</small>'+`<small> Wind Speed : ${current_weather.wind.speed}
            </small>`;
            
            
            if (temperature > 25){
                logo_weather.classList.add('fa-sun')
            }
            else if (temperature < 12)
            {
                logo_weather.classList.replace('fa-sun','fa-snowflake')
            }
            else logo_weather.classList.replace('fa-sun','fa-cloud')

            max_temp.innerHTML = 'Max temperature '+ temperature;
            // city_name.innerHTML = data.name + ` <small>${data.sys.country}</small>`
            sun_set.innerHTML = 'Sunset '+ getISTTime(current_weather.sys.sunset)
            sun_rise.innerHTML = 'Sunrise '+ getISTTime(current_weather.sys.sunrise)

}






function temperatureConverter(valNum) {
    valNum = parseFloat(valNum);
    let temp= valNum - 273.15;
    return temp
  }



const getISTTime = (utc_date)=>{

    var d = new Date(utc_date * 1000), // Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
    dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
    ampm = 'AM',
    time;

if (hh > 12) {
    h = hh - 12;
    ampm = 'PM';
} else if (hh === 12) {
    h = 12;
    ampm = 'PM';
} else if (hh == 0) {
    h = 12;
}

// ie: 2014-03-24, 3:00 PM
time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
return time;
}





    
    // function for managing forecast data
    const foreCastWeather = (data,forecastRow)=>{

        // display forcast data 
        const detail = data.city
        const daily_forcast = data.list
        const length  = daily_forcast.length
        console.log(daily_forcast)

        for (let i = 0 ;i < length ; i++)
        {   
            let colElem = document.createElement('div')
            colElem.setAttribute('class','col-md-4')
            colElem.innerHTML = 
            `<div class="card">
                <div class="card-body">
                    <h5 class="card-title">Date ${getISTTime(daily_forcast[i].dt)}</h5>
                    <p class="temp_cel"> Temperature ${temperatureConverter(daily_forcast[i].main.temp).toFixed(2)}</p>
                    <p class="max_temp">Max Temp: ${temperatureConverter(daily_forcast[i].main.temp_max).toFixed(2)}</p>
                    <p class="humidity">Humidity : ${daily_forcast[i].main.humidity}</p>
                    <p class="sun_rise"> Description : ${daily_forcast[i].weather[0].description}</p>
                </div>
            </div>`
            forecastRow.appendChild(colElem)
                                
        }


   }
