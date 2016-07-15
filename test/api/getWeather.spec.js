import test from 'ava';
import getWeather from '../../src/api/getWeather';

test('should get weather information', async t => {
  const expectedCity = 'Taichung City';
  const result = await getWeather('Taichung');

  t.is(typeof result, 'object');
  t.is(result.location.city, expectedCity);
});
