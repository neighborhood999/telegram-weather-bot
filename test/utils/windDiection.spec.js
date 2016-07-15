import test from 'ava';
import windDirection from '../../src/utils/windDirection';

test('should get wind direction text', t => {
  const inputDegree1 = '99';
  const expectedDirection1 = '東南偏東風';

  t.is(windDirection(inputDegree1), expectedDirection1);

  const inputDegree2 = '270';
  const expectedDirection2 = '西風';

  t.is(windDirection(inputDegree2), expectedDirection2);
});
