import { LocaleHeaderPipe } from './locale-header.pipe';

describe('LocaleHeaderPipe', () => {

  it('transform to local language', () => {
    const pipe = new LocaleHeaderPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform('lastname')).toBe('Прізвище');
  });
});
