import TelegramBot from 'node-telegram-bot-api';
import format from 'date-fns/format';
import getWeather from './api/getWeather';
import windDirection from './utils/windDirection';
import getForecast from './utils/getForecast';
import { today, fiveDays } from './utils/keyboard';
import { startMessage, weatherTemplate, helpMessage } from './template';

const { parsed: { TOKEN } } = require('dotenv').config();
const bot = new TelegramBot(TOKEN, { polling: true });
let todayWeatherInfo;
let forecastInfo;

bot.onText(/\/start/, message => {
  const chatId = message.chat.id;

  return bot.sendMessage(chatId, startMessage, { parse_mode: 'markdown' });
});

bot.onText(/\/help/, message => {
  const chatId = message.chat.id;

  return bot.sendMessage(chatId, helpMessage, { parse_mode: 'markdown' });
});

bot.onText(/\location/, message => {
  const chatId = message.chat.id;
  const text = '按下按鈕取得定位！';
  const replyMarkup = JSON.stringify({
    keyboard: [
      [
        {
          text: '📍 取得定位',
          request_contact: false,
          request_location: true
        }
      ]
    ],
    callback_data: 'location',
    resize_keyboard: true,
    one_time_keyboard: true
  });

  return bot.sendMessage(chatId, text, {
    reply_markup: replyMarkup,
    parse_mode: 'markdown'
  });
});

bot.onText(/\/where( (.+))?/, (message, match) => {
  const chatId = message.chat.id;
  const city = match[1];

  if (match[1] === undefined) {
    bot.sendMessage(chatId, '請輸入要查詢的位置！');
    return;
  }

  getWeather(city)
    .then(response => {
      const direction = windDirection(response.wind.direction);
      const date = format(new Date(), 'YYYY-MM-DD');
      const time = format(new Date(), 'HH:mm:ss');
      const message = weatherTemplate(response, date, time, direction);
      forecastInfo = getForecast(response);
      todayWeatherInfo = message;

      return message;
    })
    .then(message => {
      bot.sendMessage(chatId, message, {
        reply_markup: fiveDays,
        parse_mode: 'markdown'
      });
    })
    .catch(err => {
      if (err.name === 'TypeError') {
        bot.sendMessage(chatId, 'API 錯誤，請重新嘗試！');
      }
    });
});

bot.on('location', message => {
  const chatId = message.chat.id;

  getWeather(message.location)
    .then(response => {
      const direction = windDirection(response.wind.direction);
      const date = format(new Date(), 'YYYY-MM-DD');
      const time = format(new Date(), 'HH:mm:ss');
      const message = weatherTemplate(response, date, time, direction);
      forecastInfo = getForecast(response);
      todayWeatherInfo = message;

      return message;
    })
    .then(res => {
      bot.sendMessage(chatId, res, {
        reply_markup: fiveDays,
        parse_mode: 'markdown'
      });
    })
    .catch(err => {
      if (err.name === 'TypeError') {
        bot.sendMessage(chatId, 'API 錯誤，請嘗試重新定位！');
      }
    });
});

bot.on('callback_query', message => {
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
