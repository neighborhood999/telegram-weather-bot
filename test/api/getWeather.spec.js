import test from 'ava';
import mockSuccess from './mock.json';
import mockFailure from './mockFailure.json';
import getWeather from '../../src/api/getWeather';

test('should get weather information', async t => {
  const expectedCity = 'Taichung City';
  let mock = await getWeather('Taichung');
  const { channel } = mockSuccess['query']['results'];

  mock = channel; // For mock api response

  t.is(mock.location.city, expectedCity);
});

test('should get weather weather failure information', async t => {
  let mock = await getWeather('');
  mock = mockFailure;

  t.is(mock['error']['status'], '400');
  t.is(mock['error']['description'], 'Empty text');
});
