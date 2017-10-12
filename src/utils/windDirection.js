const windObj = {
  0: '無',
  45: '東北',
  90: '東',
  135: '東南',
  180: '南',
  225: '西南',
  270: '西',
  315: '西北',
  360: '北'
};

const guessDirection = input => {
  const keyArray = Object.keys(windObj);
  const filtered = keyArray.filter(value => {
    return value >= parseInt(input);
  });

  return filtered[0];
};

const windDirection = input => {
  const direction = guessDirection(input);

  if (windObj[input]) return `${windObj[input]}風`;
  if (direction - 45 < 45) return `${windObj[direction]}偏北風`;

  return `${windObj[direction]}偏${windObj[direction - 45]}風`;
};

export default windDirection;
