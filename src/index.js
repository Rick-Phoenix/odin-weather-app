import "./styles.css";
import * as nodes from "./selectors";
import icon from "./Icons/Weather/partly-cloudy-day.svg"

nodes.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const location = nodes.inputField.value;
  getWeatherData(location);
})

async function getWeatherData(place) {
  const weatherData = await fetch((`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${place}?key=XZJ5GTZYEE6PBH5PTD4CQMSYC`))
  .then((response) => response.json())
  .catch((error) => console.log(error))

  console.log(weatherData);
  for (const data of weatherData.days[0].hours) console.log(data);
  console.log(nodes.hourlyDiv);
  
  renderHourly(weatherData);
} 

function getIcon(name) {
  const icon = new Image();
  const images = require.context('./Icons/Weather', false, /\.(png|jpe?g|svg)$/);
  icon.src = images(`./${name}.svg`);
  return icon;
}

function renderHourly(data) {
  const hourlyForecastDiv = document.createElement('div');
  hourlyForecastDiv.classList.add('hourlyForecast');
  const icon = getIcon(data.days[0].icon);

  hourlyForecastDiv.append(icon)
  nodes.hourlyDiv.append(hourlyForecastDiv)
}
  
  