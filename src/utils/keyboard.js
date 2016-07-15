export const fiveDays = JSON.stringify({
  inline_keyboard: [[{
    text: '未來一週天氣',
    callback_data: 'forecast'
  }]]
});

export const today = JSON.stringify({
  inline_keyboard: [[{
    text: '今日天氣狀況',
    callback_data: 'today'
  }]]
});
