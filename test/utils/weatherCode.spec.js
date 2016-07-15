import test from 'ava';
import weatherEmoji from '../../src/utils/weatherCode';

test('should get weather emoji', t => {
  const expected = { text:'sunny', icon: '☀️' };
  const emoji = weatherEmoji(32);

  t.is(emoji, expected.icon);
});
