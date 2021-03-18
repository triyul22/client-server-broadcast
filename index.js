navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true
})

function success({ coords }) {
    const { latitude, longitude } = coords
    const position = [latitude, longitude]
    console.log(position)

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const data = JSON.parse(this.responseText);
            //console.log(this.responseText);
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
    document.getElementById("current-city").innerHTML = info["city_name"]
    document.getElementById("current-temp").innerHTML = info["temp"] + " &#176;C"
    console.log(document.getElementsByClassName("current"))

    console.log(data["data"])
}