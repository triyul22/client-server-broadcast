navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true
})

function success({ coords }) {
    const { latitude, longitude } = coords
    load_main_city(latitude, longitude)
}

function error({ message }) {
    document.getElementById("current-loader").style.visibility = 'hidden';
    const { latitude, longitude } = {latitude: 59.92708206176758, longitude: 30.3396110534668 }
    load_main_city(latitude, longitude)
}

function load_main_city(latitude, longitude){
    document.getElementById("current-flex-container").style.visibility = 'visible';
    document.getElementById("current-loader").style.visibility = 'hidden';

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const data = JSON.parse(this.responseText);
            set_current_info(data);
        }
        else if (xhr.status !== 200 && xhr.status !== 0){
            alert("Can't load the city info")
        }
    });

    const url_conn = "https://weatherbit-v1-mashape.p.rapidapi.com/current?lon=" + longitude + "&lat=" + latitude;
    xhr.open("GET", url_conn);
    xhr.setRequestHeader("x-rapidapi-key", "d71d9addf4msh78bd8a995732d4dp11d03djsnc36475894a13");
    xhr.setRequestHeader("x-rapidapi-host", "weatherbit-v1-mashape.p.rapidapi.com");

    xhr.send();
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

function add_city(e) {

    const city = document.getElementById("add-city").value
    document.getElementById("add-city").value = ""

    const favourite_cities = localStorage.getItem('favourite') !== null ?
        JSON.parse(localStorage.getItem('favourite'))
        : [];

    favourite_cities.push(city)

    localStorage.setItem('favourite', JSON.stringify(favourite_cities))

    load_city_info(city)
}

function load_city_info(city_name){
    const data = null;
    const li = createElement(city_name)
    document.getElementById("favourite-list").appendChild(li)

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText)
            fill_favourite_html(this.responseText, li);
        }
        else if (xhr.status !== 200 && xhr.status !== 0){
            alert("Can't load the city info")
        }
    });
    xhr.open("GET", "http://localhost:3000/weather/city?q=" + city_name)
/*    xhr.open("GET", "https://community-open-weather-map.p.rapidapi.com/find?q=" + city_name + "&cnt=1&mode=null&lon=0&type=link%2C%20accurate&lat=0&units=imperial%2C%20metric");
    xhr.setRequestHeader("x-rapidapi-key", "d71d9addf4msh78bd8a995732d4dp11d03djsnc36475894a13");
    xhr.setRequestHeader("x-rapidapi-host", "community-open-weather-map.p.rapidapi.com");*/

    xhr.send(data);
}

function fill_favourite_html(params, li){
    const weather_info = JSON.parse(params)["list"][0]

    const div_main_container = li.children[0]

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

    div_main_container.insertBefore(div_image, div_main_container.lastElementChild)
    div_main_container.insertBefore(span, div_main_container.lastElementChild)

    const div_list = document.createElement("div")
    div_list.className = "weather-list"

    const ul = createWeatherList(weather_info)

    div_list.appendChild(ul)
    li.appendChild(div_list)

    const loader = li.childNodes[1]
    loader.remove()

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

function createElement(city_name){
    const li_element = document.createElement("li");
    li_element.className = "favourite"
    const div_main_container = document.createElement("div")
    div_main_container.className = "flex-container"

    const h3 = document.createElement("h3")
    h3.className = "city"
    h3.innerHTML = city_name

    const button = document.createElement("button")
    button.className = "add-button"
    button.innerHTML = "x"
    button.onclick = function (){
        console.log(button.parentElement.parentElement.remove())
        const favourite_list = JSON.parse(localStorage.getItem("favourite"))
        //const index = favourite_list.indexOf(weather_info["name"])
        const index = favourite_list.indexOf(city_name)
        favourite_list.splice(index, 1)
        localStorage.setItem("favourite", JSON.stringify(favourite_list))
    }

    const div_loader = document.createElement("div")
    div_loader.style.display = "flex"
    const img_loader = document.createElement("img")
    img_loader.src = "loader.gif"
    img_loader.alt = "Waiting, please. The info is loading"
    img_loader.style.maxWidth = "50%"
    img_loader.style.margin = "10px auto"
    div_loader.appendChild(img_loader)

    div_main_container.appendChild(h3)

    div_main_container.appendChild(button)

    li_element.appendChild(div_main_container)
    li_element.appendChild(div_loader)
    console.log(li_element)


    return li_element
}

setTimeout(function() {
    if (localStorage.getItem('favourite') !== null) {
        JSON.parse(localStorage.getItem('favourite')).forEach(function (city) {
            console.log(city)
            load_city_info(city);
        })
    }
}, 100)