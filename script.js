const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");


let API_KEY="d1845658f92b31c64bd94f06f7188c9c";
let oldTab=userTab;
oldTab.classList.add("current-tab");
getFromSessionStorage();

//To check on which tab I clicked accordingly I have to switch between tabs --> 1.userTab / 2.searchTab

function switchTab(newTab){

    if( newTab != oldTab){
        // shift the background color to clicked tab 

        //current-tab is css class having grey backgroud color
        
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        //To show visiblity on clicked Tab
        if(!searchForm.classList.contains("active")){   //condition says that search form ke upar active class nahi hai toh
            //now we are at search section
            userInfoContainer.classList.remove("active");    // user's information se remove krlo active class
            grantAccessContainer.classList.remove("active");     // wohh apni location ko access dena woh wali ko hide kara doo.  grant access wali window ko bhi hide kar doo
            searchForm.classList.add("active");               // make searchForm visible using active class    
        }
        else{            
            // now We are at your weather section
            searchForm.classList.remove("active");   // searchForm is invisible using active class
            userInfoContainer.classList.remove("active");
            //so I am in your weather tab and I have to display weather, 
            //so let's check local storage first for coordinates. If we saved them there 
            getFromSessionStorage();    
        }
    }
}

userTab.addEventListener("click", ()=>{
    switchTab(userTab);          //After click userTab switch to userTab using switch function 

});
searchTab.addEventListener("click", ()=>{
    switchTab(searchTab);       //After click searchTab switch to searchTab using switch function 

});

function getFromSessionStorage(){    
    const localCoordinates=sessionStorage.getItem("user-coordinates");   //kya session storage ke andar user-coordinates ki Item present hai kya
    if(!localCoordinates){     //Agar nahi hai toh
        //Show the Grant access container
        grantAccessContainer.classList.add("active");
    }
    else{   //Agar hai toh coordinates fetch karo
        const coordinates= JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates); 
    }
}
//we have to call API so we use async function here
async function fetchUserWeatherInfo(coordinates){
    console.log("fetchWeatherInfo mai ho aap");
    const {lat, lon} = coordinates;
    //so here an API is called so it take some time to fetch data 
    //we have to make an grant Access continer invisible
    grantAccessContainer.classList.remove("active");
    //we have to show the loader on it
    loadingScreen.classList.add("active");
    //API CALL
    try {
        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const data= await response.json();
        //Now we got the data so we have to remove loader
        loadingScreen.classList.remove("active");
        //we have data to display so we make user info container visible
        userInfoContainer.classList.add("active");
        // we have to render the values on UI Dynamically
        renderWeatherInfo(data);

    } catch (error) {
        loadingScreen.classList.remove("active");
        //In these we have to show Data not available on UI
    }
}

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log("Weather info", weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    
    console.log("value rendered to UI");
    

}

function getLocation(){
    //we'ill use Geolocation API to fetch user location
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition, showError);
        
    }
    else{
        //alert for no loction

    }

}

function showPosition(position){
    
    //user's latitude and longitude
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);  //here we are featching the user's weather information

}

function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log( "User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
    console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
    }
  }



const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }


})
//city wala data fetching from API and rendering on UI
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );        
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        

    } catch (error) {
        
    }

    

}

