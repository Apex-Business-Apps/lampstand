import { describe, it, expect } from "vitest";
import { parseStoredDate, formatLocalDate, getRelativeLocalDate } from "../lib/date";

describe("formatLocalDate", () => {
  it("should format date correctly as YYYY-MM-DD", () => {
    const date = new Date(2023, 4, 15); // May 15, 2023 (Local)
    const result = formatLocalDate(date);
    // Since it uses local date, we need to be careful.
    // The implementation uses getFullYear, getMonth, getDate
    const expected = `2023-05-15`;
    expect(result).toBe(expected);
  });

  it("should use current date if no date is provided", () => {
    const now = new Date();
    const result = formatLocalDate();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    expect(result).toBe(expected);
  });
});

describe("getRelativeLocalDate", () => {
  it("should return correct date for positive offset", () => {
    const baseDate = new Date(2023, 4, 15);
    const result = getRelativeLocalDate(1, baseDate);
    expect(result).toBe("2023-05-16");
  });

  it("should return correct date for negative offset", () => {
    const baseDate = new Date(2023, 4, 15);
    const result = getRelativeLocalDate(-1, baseDate);
    expect(result).toBe("2023-05-14");
  });

  it("should handle month boundaries", () => {
    const baseDate = new Date(2023, 4, 1);
    const result = getRelativeLocalDate(-1, baseDate);
    expect(result).toBe("2023-04-30");
  });

  it("should handle year boundaries", () => {
    const baseDate = new Date(2023, 0, 1);
    const result = getRelativeLocalDate(-1, baseDate);
    expect(result).toBe("2022-12-31");
  });
});

describe("parseStoredDate", () => {
  it("should parse valid DMY format with slashes", () => {
    const result = parseStoredDate("15/05/2023");
    expect(result).not.toBeNull();
    expect(result?.getUTCFullYear()).toBe(2023);
    expect(result?.getUTCMonth()).toBe(4); // May is 4
    expect(result?.getUTCDate()).toBe(15);
  });

  it("should parse valid DMY format with dashes", () => {
    const result = parseStoredDate("31-12-2023");
    expect(result).not.toBeNull();
    expect(result?.getUTCFullYear()).toBe(2023);
    expect(result?.getUTCMonth()).toBe(11); // December is 11
    expect(result?.getUTCDate()).toBe(31);
  });

  it("should parse valid ISO format", () => {
    const result = parseStoredDate("2023-05-15");
    expect(result).not.toBeNull();
    expect(result?.getUTCFullYear()).toBe(2023);
    expect(result?.getUTCMonth()).toBe(4);
    expect(result?.getUTCDate()).toBe(15);
  });

  it("should handle single digit day and month in DMY", () => {
    const result = parseStoredDate("1/2/2023");
    expect(result).not.toBeNull();
    expect(result?.getUTCFullYear()).toBe(2023);
    expect(result?.getUTCMonth()).toBe(1); // February
    expect(result?.getUTCDate()).toBe(1);
  });

  it("should handle 2-digit years", () => {
    const result = parseStoredDate("15/05/23");
    expect(result?.getUTCFullYear()).toBe(2023);
  });

  it("should return null for empty or null string", () => {
    expect(parseStoredDate("")).toBeNull();
  });

  it("should return null for invalid format", () => {
    expect(parseStoredDate("not-a-date")).toBeNull();
    expect(parseStoredDate("15/05")).toBeNull();
    expect(parseStoredDate("2023-15-05")).toBeNull(); // Month 15
  });

  it("should return null for non-existent dates (DMY)", () => {
    expect(parseStoredDate("31/04/2023")).toBeNull(); // April has 30 days
    expect(parseStoredDate("29/02/2023")).toBeNull(); // 2023 is not a leap year
    expect(parseStoredDate("32/01/2023")).toBeNull(); // Day 32
    expect(parseStoredDate("15/13/2023")).toBeNull(); // Month 13
  });

  it("should return null for non-existent dates (ISO)", () => {
    expect(parseStoredDate("2023-04-31")).toBeNull();
    expect(parseStoredDate("2023-02-29")).toBeNull();
    expect(parseStoredDate("2023-13-01")).toBeNull();
  });

  it("should handle leap years correctly", () => {
    const leapYear = parseStoredDate("29/02/2024");
    expect(leapYear).not.toBeNull();
    expect(leapYear?.getUTCFullYear()).toBe(2024);
    expect(leapYear?.getUTCMonth()).toBe(1);
    expect(leapYear?.getUTCDate()).toBe(29);
  });
});
