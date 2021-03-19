navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true
})

function success({ coords }) {
    document.getElementById("current-flex-container").style.visibility = 'visible';
    console.log(document.getElementById("current-flex-container"))
    document.getElementById("current-loader").style.visibility = 'hidden';
    const { latitude, longitude } = coords

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const data = JSON.parse(this.responseText);
            console.log(this.responseText);
            set_current_info(data);
        }
    });

    const url_conn = "https://weatherbit-v1-mashape.p.rapidapi.com/current?lon=" + longitude + "&lat=" + latitude;
    xhr.open("GET", url_conn);
    xhr.setRequestHeader("x-rapidapi-key", "d71d9addf4msh78bd8a995732d4dp11d03djsnc36475894a13");
    xhr.setRequestHeader("x-rapidapi-host", "weatherbit-v1-mashape.p.rapidapi.com");

    xhr.send();
}

function error({ message }) {
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

function add_city(el) {
    console.log(el)
    const favourite_cities = localStorage.getItem('favourite')
    localStorage.setItem('favourite', [])
}