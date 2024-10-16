import "./styles.css";
import * as nodes from "./selectors";

nodes.form.addEventListener('submit', (e) => {
  e.preventDefault();
  let location = nodes.inputField.value;
  getWeatherData(location);
  nodes.form.reset();
})

async function getWeatherData(place) {
  let weatherData = await fetch((`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${place}?unitGroup=metric&key=XZJ5GTZYEE6PBH5PTD4CQMSYC`))
  .then((response) => response.json())
  .catch((error) => console.log(error))

  console.log(weatherData);
  render14D(weatherData);
  renderHourly(weatherData);
  renderDetails(weatherData);
  
  nodes.body.style.setProperty('--pseudo', 'flex');
} 

function getIcon(name, type, format) {
  const icon = new Image();
  const images = require.context('./Icons/Weather', false, /\.(png|jpe?g|svg)$/);
  icon.src = images(`./${name}.${format}`);
  icon.classList.add('icon', type);
  return icon;
}

function renderHourly(data) {
  nodes.h3.textContent = `Here's the weather for today in ${data.resolvedAddress}.`;
  nodes.logo.style.fontWeight = '800';
  nodes.logo.textContent = 'BestestWeatherApp';
  nodes.hourlyDiv.innerHTML = '';
  nodes.main.classList.remove('hidden');
  const currentHour = new Date().getHours();
  const totalCells = 24 - currentHour;
  for (const hour in data.days[0].hours) {
    if (hour >= currentHour) {
      const hourlyForecastDiv = document.createElement('div');
      hourlyForecastDiv.classList.add('hourlyForecast');
      const icon = getIcon(data.days[0].hours[hour].icon, 'hourly', 'svg');
      const time = document.createElement('div');
      time.classList.add('time');
      time.textContent = data.days[0].hours[hour].datetime.match(/\d\d:\d\d/)[0];
      const conditions = document.createElement('div');
      conditions.classList.add('conditions');
      conditions.textContent = data.days[0].hours[hour].conditions;
      const temperature = document.createElement('div');
      temperature.classList.add('temperature');
      temperature.textContent = data.days[0].hours[hour].temp + '°';

      if (hour == 23 || !(totalCells % 2) && hour == 22) {
        hourlyForecastDiv.style.setProperty('--show', 'transparent')
      }

      hourlyForecastDiv.append(icon, time, conditions, temperature);
      nodes.hourlyDiv.append(hourlyForecastDiv);
    };
  };
}

function renderDetails(data) {
  nodes.detailsDiv.innerHTML = '';
  const iconsArr = {
    'Perceived Temperature': {APIValue: 'feelslike', unit: '°'},
    'Wind Speed': {APIValue: 'windspeed', unit: ' km/h'},
    'Relative Humidity': {APIValue: 'humidity', unit: '%'},
    'Precipitation Probability': {APIValue: 'precipprob', unit: '%'},
    'UV Intensity': {APIValue: 'uvindex', unit: '/11'},
};

  for (const element in iconsArr) {
    const description = element;
    const APIvalue = data.days[0][iconsArr[element].APIValue];
    const unit = iconsArr[element].unit;
    const weatherDetail = document.createElement('div');
    weatherDetail.classList.add('weatherDetail');
    const icon = getIcon(description, 'details', 'png');
    const detailName = document.createElement('span');
    detailName.className = 'detailName';
    detailName.textContent = description;
    const detailValue = document.createElement('span');
    detailValue.className = 'detailValue';
    detailValue.textContent = APIvalue + unit;

    weatherDetail.append(icon, detailName, detailValue);
    nodes.detailsDiv.append(weatherDetail);
  }
}


function render14D(data) {
  nodes.dailyDiv.innerHTML = '';
  for (const day in data.days) if (day > 0) {
    const currentDay = data.days[day];
    const {icon: iconName, datetime, conditions, tempmin, tempmax} = currentDay;
    const formattedDate = datetime.match(/\d\d-\d\d$/)[0];
    const icon = getIcon(iconName, '14D', 'svg');
    const dailyForecast = document.createElement('div');
    dailyForecast.classList.add('singleDailyDiv');
    const dateSpan = document.createElement('span');
    dateSpan.textContent = formattedDate;
    dateSpan.className = 'date';
    const conditionsSpan = document.createElement('span');
    conditionsSpan.classList.add('conditions');
    conditionsSpan.textContent = conditions;
    const tempSpan = document.createElement('span');
    tempSpan.classList.add('temperature');
    tempSpan.textContent = `${tempmin}° - ${tempmax}°`;

    if (data.days.indexOf(currentDay) == 13 || data.days.indexOf(currentDay) == 14) {
      dailyForecast.style.setProperty('--show', 'transparent');
    }

    dailyForecast.append(icon, dateSpan, conditionsSpan, tempSpan);
    nodes.dailyDiv.append(dailyForecast);

  }
}