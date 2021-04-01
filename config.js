exports.dbPath = `${__dirname}/db/${exports.dbName}.sqlite`;
exports.maxFavoriteCities = 10;

const openWeatherApiKey = 'd71d9addf4msh78bd8a995732d4dp11d03djsnc36475894a13';
exports.weatherByLocationURL = `https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=${openWeatherApiKey}`;
exports.weatherByCityURL = `https://api.openweathermap.org/data/2.5/weather?q=$city&appid=${openWeatherApiKey}`;