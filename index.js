const express = require('express');

const app = express();
const axios = require("axios");

app.get('/', (req, res) => res.send('Hello there!'));

app.get('/weather/city', function (req, res) {
    console.log(req.params)

    const options = {
        method: 'GET',
        url: 'https://community-open-weather-map.p.rapidapi.com/weather',
        params: {
            q: req.query.q,
            id: '2172797',
            lang: 'null',
            units: '"metric" or "imperial"',
            mode: 'xml, html'
        },
        headers: {
            'x-rapidapi-key': 'd71d9addf4msh78bd8a995732d4dp11d03djsnc36475894a13',
            'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
        res.send(response.data)
    }).catch(function (error) {
        console.error(error);
    });
})

router.get('/weather/city?lat=:latitude&lon=longitude', function (req, res) {


    console.log(req.query.latitude)
    res.send(req.query.longitude)
})


app.listen(3000, () => console.log('Application started on port 3000'));