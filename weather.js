const fs = require('fs');
const axios = require('axios');
const yargs = require('yargs');

// Чтение файла конфигурации
const configPath = './config.json';
let config = {};
if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath);
    config = JSON.parse(configData);
}

// Обработка аргументов командной строки
const argv = yargs
    .options({
        s: {
            alias: 'city',
            describe: 'Указать город для получения информации о погоде',
        },
        t: {
            alias: 'token',
            describe: 'Указать токен для доступа к API',
        },
        h: {
            alias: 'help',
            describe: 'Показать справку',
        }
    })
    .example('Запрос: node weather.js -s [город] -t [токен]')
    .example('node weather.js -s "Москва"', 'Показать погоду в Москве')
    .example('node weather.js -s "Лондон" -t "ВашТокен"', 'Показать погоду в Лондоне с указанием иного токена')
    .help()
    .alias('help', 'h')
    .argv;

// Обновление конфигурации
if (argv.city) {
    config.city = argv.city;
}
if (argv.token) {
    config.apiKey = argv.token;
}

// Функция для получения погоды
async function getWeather(city, apiKey) {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`);
        return response.data;
    } catch (error) {
        throw new Error('Ошибка при получении данных о погоде. Проверьте корректность города и API токена!!');
    }
}

// Получение и вывод инфы из запроса
getWeather(config.city, config.apiKey)
    .then(weatherData => {
        console.log('Информация о погоде:');
        console.log(`Город: ${weatherData.name}`);
        console.log(`Температура: ${weatherData.main.temp}°C`);
        console.log(`Погода: ${weatherData.weather[0].description}`);
        console.log(`Языковой код: ${weatherData.sys.country}`)
    })
    .catch(error => {
        console.error(error.message);
    });