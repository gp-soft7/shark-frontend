import { AbsoluteValuePipe } from './absolute-value.pipe';

describe('AbsoluteValuePipe', () => {
  const pipe = new AbsoluteValuePipe();

  it('should transform negative value to positive', () => {
    expect(pipe.transform(-5)).toBe(5);
  });

  it('should transform positive value to positive', () => {
    expect(pipe.transform(10)).toBe(10);
  });
});
