import { initials } from './initials.pipe';

describe('initials', () => {
  it.each([
    ['Jane Doe', 'JD'],
    ['jane q. doe', 'JD'],
    ['Cher', 'C'],
    ['   ', '?'],
  ])('%j → %s', (name, expected) => {
    expect(initials(name)).toBe(expected);
  });
});
