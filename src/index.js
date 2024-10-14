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
  renderHourly(weatherData);
  renderDetails(weatherData);
  render14D(weatherData);
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

      hourlyForecastDiv.append(icon, time, conditions, temperature);
      nodes.hourlyDiv.append(hourlyForecastDiv);
    };
  };
}

function renderDetails(data) {
  nodes.thirdCard.innerHTML = '';
  const iconsArr = {
    feelslike: 'Perceived Temperature', windspeed: 'Wind Speed', humidity: 'Relative Humidity', precipprob: 'Precipitation %', uvindex: 'UV Intensity',
  };

  for (const element in iconsArr) {
    const description = iconsArr[element];
    const APIvalue = data.days[0][element];
    const weatherDetail = document.createElement('div');
    weatherDetail.classList.add('weatherDetail');
    const icon = getIcon(description, 'details', 'png');
    const detailName = document.createElement('span');
    detailName.className = 'detailName';
    detailName.textContent = description;
    const detailValue = document.createElement('span');
    detailValue.className = 'detailValue';
    detailValue.textContent = APIvalue;

    weatherDetail.append(icon, detailName, detailValue);
    nodes.thirdCard.append(weatherDetail);
  }
}


function render14D(data) {
  // Icon, description, min-max temp
  nodes.firstCard.innerHTML = '';
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
    tempSpan.textContent = `${tempmin}°-${tempmax}°`;

    dailyForecast.append(icon, dateSpan, conditionsSpan, tempSpan);
    nodes.firstCard.append(dailyForecast);

  }
}

  