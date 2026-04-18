import { describe, it, expect } from 'vitest';
import { validateTermFormat, validateDepartment, validateCourseInput } from '../../app/utils/validation';

describe('Course Validation Utility', () => {
  it('1. should validate term formats correctly', () => {
    // valid terms
    expect(validateTermFormat('2026W1')).toBe(true);
    expect(validateTermFormat('1999S2')).toBe(true);
    
    // invalid terms
    expect(validateTermFormat('2020Z1')).toBe(false);
    expect(validateTermFormat('2020W3')).toBe(false);
    expect(validateTermFormat('W1')).toBe(false);
  });

  it('2. should validate departments correctly', () => {
    expect(validateDepartment('CS')).toBe(true);
    expect(validateDepartment('BIOLOGY')).toBe(false);
  });

  it('3. should return specific error messages on invalid input', () => {
    expect(validateCourseInput('', 'CS', '2026W1')).toBe('Course title is required.');
    expect(validateCourseInput('React 101', 'FAKE', '2026W1')).toBe('Invalid department selected.');
    expect(validateCourseInput('React 101', 'CS', '2026')).toBe('Invalid term format. Use format like 2026W1 or 1999S2.');
    expect(validateCourseInput('React 101', 'CS', '2026W1')).toBe(null); // success
  });
});