import { getEnumValue } from './enum.util';

describe('getEnumValue', () => {
  enum TestEnum {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
  }

  it('should return empty string for null or undefined value', () => {
    expect(getEnumValue(TestEnum, '')).toBe('');
    expect(getEnumValue(TestEnum, null as any)).toBe('');
    expect(getEnumValue(TestEnum, undefined as any)).toBe('');
  });

  it('should return matching enum value for valid key', () => {
    expect(getEnumValue(TestEnum, 'ACTIVE')).toBe('Active');
    expect(getEnumValue(TestEnum, 'INACTIVE')).toBe('Inactive');
  });

  it('should return original value if no matching enum key found', () => {
    const nonExistingValue = 'NON_EXISTING';
    expect(getEnumValue(TestEnum, nonExistingValue)).toBe(nonExistingValue);
  });

  it('should handle case-sensitive matching', () => {
    expect(getEnumValue(TestEnum, 'active')).toBe('Active');
    expect(getEnumValue(TestEnum, 'ACTIVE')).toBe('Active');
  });
});
