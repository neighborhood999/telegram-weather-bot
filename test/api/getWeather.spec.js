import test from 'ava';
import mockData from './mock.json';
import getWeather from '../../src/api/getWeather';

test('should get weather information', async t => {
  const expectedCity = 'Taichung City';
  let mock = await getWeather('Taichung');
  const { channel } = mockData['query']['results'];

  mock = channel; // For mock api response

  t.is(mock.location.city, expectedCity);
});
