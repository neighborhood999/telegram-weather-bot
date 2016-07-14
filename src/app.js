import TelegramBot from 'node-telegram-bot-api';
import format from 'date-fns/format';
import getWeather from './api/getWeather';
import windDirection from './utils/windDirection';
import getForecast from './utils/getForecast';
import { startMessage, weatherTemplate, helpMessage } from './template';

const token = 'Your token';
const bot = new TelegramBot(token, { polling: true });
const fiveDays = JSON.stringify({
  inline_keyboard: [[{
    text: '未來一週天氣',
    callback_data: 'forecast'
  }]]
});
const today = JSON.stringify({
  inline_keyboard: [[{
    text: '今日天氣狀況',
    callback_data: 'today'
  }]]
});
let todayWeatherInfo;
let forecastInfo;

bot.onText(/\/start/, (message) => {
  const fromId = message.from.id;

  return bot.sendMessage(fromId, startMessage, { parse_mode: 'markdown' });
});

bot.onText(/\/help/, (message) => {
  const fromId = message.from.id;

  return bot.sendMessage(fromId, helpMessage, { parse_mode: 'markdown' });
});

bot.onText(/\location/, (message) => {
  const fromId = message.from.id;
  const text = '按下按鈕取得定位！';
  const replyMarkup = JSON.stringify({
    keyboard: [[{
      text: '📍 取得定位',
      request_contact: false,
      request_location: true
    }]],
    callback_data: 'location',
    resize_keyboard: true,
    one_time_keyboard: true
  });

  return bot.sendMessage(fromId, text, { reply_markup: replyMarkup, parse_mode: 'markdown' });
});

bot.onText(/\/where( (.+))?/, (message, match) => {
  const fromId = message.from.id;
  const city = match[1];

  if (match[1] === undefined) {
    bot.sendMessage(fromId, '請輸入要查詢的位置！');
    return;
  }

  getWeather(city).then(response => {
    const direction = windDirection(response.wind.direction);
    const date = format(new Date(), 'YYYY-MM-DD');
    const time = format(new Date(), 'HH:mm:ss');
    const message = weatherTemplate(response, date, time, direction);
    forecastInfo = getForecast(response);
    todayWeatherInfo = message;

    return message;
  })
  .then(message => {
    bot.sendMessage(fromId, message, { reply_markup: fiveDays, parse_mode: 'markdown' });
  })
  .catch(err => {
    if (err.name === 'TypeError') {
      bot.sendMessage(fromId, 'API 錯誤，請重新嘗試！');
    }
  });
});

bot.on('location', (message) => {
  const fromId = message.from.id;

  getWeather(message.location).then(response => {
    const direction = windDirection(response.wind.direction);
    const date = format(new Date(), 'YYYY-MM-DD');
    const time = format(new Date(), 'HH:mm:ss');
    const message = weatherTemplate(response, date, time, direction);
    forecastInfo = getForecast(response);
    todayWeatherInfo = message;

    return message;
  })
  .then(res => {
    bot.sendMessage(fromId, res, { reply_markup: fiveDays, parse_mode: 'markdown' });
  })
  .catch(err => {
    if (err.name === 'TypeError') {
      bot.sendMessage(fromId, 'API 錯誤，請重新定位嘗試！');
    }
  });
});

bot.on('callback_query', (message) => {
  if (message.data === 'forecast') {
    const optional = {
      reply_markup: today,
      parse_mode: 'markdown',
      chat_id: message.message.chat.id,
      message_id: message.message.message_id
    };

    bot.editMessageText(forecastInfo, optional);
  }

  if (message.data === 'today') {
    const optional = {
      reply_markup: fiveDays,
      parse_mode: 'markdown',
      chat_id: message.message.chat.id,
      message_id: message.message.message_id
    };

    bot.editMessageText(todayWeatherInfo, optional);
  }
});
