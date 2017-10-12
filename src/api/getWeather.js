/* eslint-disable no-console */
import fetch from 'isomorphic-fetch';

const getWeatherInfo = (query, u = 'c') => {
  const arg =
    typeof query === 'object'
      ? `(${query.latitude}, ${query.longitude})`
      : query;
  const api = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where u='${u}' AND woeid in (select woeid from geo.places(1) where text="${arg}")&format=json`;

  return fetch(api)
    .then(response => response.json())
    .then(json => {
      if (json['error']) {
        throw json;
      }

      return json.query.results.channel;
    });
};

const getWeather = async city => {
  try {
    const result = await getWeatherInfo(city);
    return result;
  } catch (err) {
    console.log(err);
  }
};

export default getWeather;
