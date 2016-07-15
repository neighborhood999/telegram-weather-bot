import test from 'ava';
import getForecast from '../../src/utils/getForecast';
import mockResponse from './apiInfo';

test('should get five days weather information', t => {
  const expectedType = 'string';
  const expectedText = '☀️ 未來一週天氣';

  t.is(typeof getForecast(mockResponse), expectedType);
  t.is(getForecast(mockResponse).match(/^☀️ 未來一週天氣/)[0], expectedText);
});
