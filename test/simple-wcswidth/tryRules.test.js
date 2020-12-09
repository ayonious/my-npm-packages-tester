const { wcswidth, wcwidth } = require('simple-wcswidth');


describe('Example: width calculation', () => {
  it(`Simple`, function () {
    expect(wcswidth('asdf')).toBe(4);
    expect(wcwidth('请'.charCodeAt(0))).toBe(2);
  });
});
