import format from 'date-fns/format';
import weatherEmoji from './weatherCode';
import { forecastTemplate } from '../template';

const getForecast = response => {
  let text = [];
  let fiveDayForecast = '';
  let result;
  const days = response.item.forecast.slice(0, 8);

  days.map(day => {
    let date = format(day.date, 'YYYY-MM-DD');
    let message = `
📅 *${date} - ${day.day}*
🔰 最低溫和最高溫 ➡️ ${day.low}°C - ${day.high}°C
🌀天氣狀態 ➡️ ${weatherEmoji(day.code)}
`;

    return text.push(message);
  });
  text.map(day => (fiveDayForecast += `${day} \n`));
  result = forecastTemplate(fiveDayForecast, response.link);

  return result;
};

export default getForecast;
