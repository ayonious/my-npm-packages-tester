const { wcswidth } = require('simple-wcswidth');

describe('Example: width calculation', () => {
  it(`Simple`, function () {
    // Step1: Define your conditional rules
    expect(wcswidth('asdf')).toBe(4);
  });
});
