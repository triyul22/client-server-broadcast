navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true
})

function success({ coords }) {
    document.getElementById("current-flex-container").style.visibility = 'visible';
    document.getElementById("current-loader").style.visibility = 'hidden';
    const { latitude, longitude } = coords

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const data = JSON.parse(this.responseText);
            set_current_info(data);
        }
        else {
            alert("Can't load the city info")
        }
    });

    const url_conn = "https://weatherbit-v1-mashape.p.rapidapi.com/current?lon=" + longitude + "&lat=" + latitude;
    xhr.open("GET", url_conn);
    xhr.setRequestHeader("x-rapidapi-key", "d71d9addf4msh78bd8a995732d4dp11d03djsnc36475894a13");
    xhr.setRequestHeader("x-rapidapi-host", "weatherbit-v1-mashape.p.rapidapi.com");

    xhr.send();
}

function error({ message }) {
    const default_city = "London"
    load_city_info(default_city)
    console.log(message)
}

function set_current_info(data) {
    const info = data["data"][0]

    const weather_icon = info["weather"]["icon"].substring(1)
    const weather_list = document.getElementsByClassName("current")[0].children

    document.getElementById("current-city").innerHTML = info["city_name"]
    document.getElementById("current-img").src = "https://api.openweathermap.org/img/w/" + weather_icon + ".png"
    document.getElementById("current-temp").innerHTML = info["temp"] + " &#176;C"

    weather_list[0].children[1].innerHTML = info["wind_spd"] + "m/s, " + info["wind_cdir_full"]
    weather_list[1].children[1].innerHTML = info["clouds"] + "%"
    weather_list[2].children[1].innerHTML = info["pres"] + " hps"
    weather_list[3].children[1].innerHTML = info["rh"] + "%"
    weather_list[4].children[1].innerHTML = "[" + info["lat"] + ", " + info["lon"] + "]"
}

function add_city() {
    const city = document.getElementById("add-city").value

    const favourite_cities = localStorage.getItem('favourite') !== null ?
        JSON.parse(localStorage.getItem('favourite'))
        : [];

    favourite_cities.push(city)

    localStorage.setItem('favourite', JSON.stringify(favourite_cities))
}

function load_city_info(city_name){
    const data = null;

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            fill_favourite_html(this.responseText);
        }
        else {
            alert("Can't load the city info")
        }
    });

    xhr.open("GET", "https://community-open-weather-map.p.rapidapi.com/find?q=" + city_name + "&cnt=1&mode=null&lon=0&type=link%2C%20accurate&lat=0&units=imperial%2C%20metric");
    xhr.setRequestHeader("x-rapidapi-key", "d71d9addf4msh78bd8a995732d4dp11d03djsnc36475894a13");
    xhr.setRequestHeader("x-rapidapi-host", "community-open-weather-map.p.rapidapi.com");

    xhr.send(data);
    console.log(this)
}

function fill_favourite_html(params){
    const info = JSON.parse(params)["list"][0]
    console.log(info)

    const li = createElement(info)

    document.getElementById("favourite-list").appendChild(li)
}

function createWeatherList(weather_info){
    const info_arr = {
        "Wind": weather_info["wind"]["speed"] + " m/s, " + weather_info["wind"]["deg"] + " deg",
        "Cloudiness": weather_info["clouds"]["all"] + "%",
        "Pressure": weather_info["main"]["pressure"] + " hps",
        "Humidity": weather_info["main"]["humidity"] + "%",
        "Coordinates": "[" + weather_info["coord"]["lat"].toFixed(2) + ", " +  weather_info["coord"]["lon"].toFixed(2) + "]"
    }

    const ul = document.createElement("ul")
    ul.className = "list"
    let li;
    let span;
    let p;

    for (let key in info_arr) {
        li = document.createElement("li")
        span = document.createElement("span")
        span.innerHTML = key
        p = document.createElement("p")
        p.className = "description"
        p.innerHTML = info_arr[key]
        li.appendChild(span)
        li.appendChild(p)

        ul.appendChild(li)
    }
    return ul
}

function createElement(weather_info){
    const li_element = document.createElement("li");
    li_element.className = "favourite"
    const div_main_container = document.createElement("div")
    div_main_container.className = "flex-container"

    const h3 = document.createElement("h3")
    h3.className = "city"
    h3.innerHTML = weather_info["name"]

    const div_image = document.createElement("div")
    div_image.className = "favourite-image"

    const img = document.createElement("img")
    img.src = "https://api.openweathermap.org/img/w/" + weather_info["weather"][0]["icon"] + ".png"
    img.alt = "Weather icon"

    div_image.appendChild(img)

    const span = document.createElement("span")
    span.className = "temperature favourite-temp"
    let cur_temp = Math.floor(parseFloat(weather_info["main"]["temp"]) - 273.15)
    span.innerHTML = cur_temp.toString() + " &#176;C"

    const button = document.createElement("button")
    button.className = "add-button"
    button.innerHTML = "x"
    button.onclick = function (){
        console.log(button.parentElement.parentElement.remove())
        const favourite_list = JSON.parse(localStorage.getItem("favourite"))
        const index = favourite_list.indexOf(weather_info["name"])
        favourite_list.splice(index, 1)
        localStorage.setItem("favourite", JSON.stringify(favourite_list))
    }

    div_main_container.appendChild(h3)
    div_main_container.appendChild(div_image)
    div_main_container.appendChild(span)
    div_main_container.appendChild(button)

    li_element.appendChild(div_main_container)

    const div_list = document.createElement("div")
    div_list.className = "weather-list"

    const ul = createWeatherList(weather_info)

    div_list.appendChild(ul)
    li_element.appendChild(div_list)

    return li_element

}

if (localStorage.getItem('favourite') !== null){
    JSON.parse(localStorage.getItem('favourite')).forEach(function (city) {
        load_city_info(city);
    })
}