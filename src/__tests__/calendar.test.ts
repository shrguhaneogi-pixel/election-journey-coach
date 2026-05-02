import { describe, it, expect } from 'vitest';
import { generateGoogleCalendarUrl } from '../lib/calendar/google-calendar';

describe('generateGoogleCalendarUrl', () => {
  it('returns a valid Google Calendar URL', () => {
    const url = generateGoogleCalendarUrl('Election Day', 'Important deadline', 'Nov 5');
    expect(url).toMatch(/^https:\/\/calendar\.google\.com\/calendar\/render/);
  });

  it('includes action=TEMPLATE in the URL', () => {
    const url = generateGoogleCalendarUrl('Election Day', 'Details', 'Nov 5');
    expect(url).toContain('action=TEMPLATE');
  });

  it('encodes the event title in the URL', () => {
    const url = generateGoogleCalendarUrl('Voter Registration', 'Register to vote', 'Oct 10');
    expect(url).toContain('text=Voter+Registration');
  });

  it('encodes the details in the URL', () => {
    const url = generateGoogleCalendarUrl('Test', 'Election Deadline Reminder', 'Oct 1');
    expect(url).toContain('details=Election+Deadline+Reminder');
  });

  it('includes a dates parameter in YYYYMMDD/YYYYMMDD format', () => {
    const url = generateGoogleCalendarUrl('Test', 'Test', 'Jan 1');
    // URLSearchParams encodes '/' as '%2F', so we check the decoded params
    const params = new URL(url).searchParams;
    const dates = params.get('dates');
    expect(dates).toMatch(/^\d{8}\/\d{8}$/);
  });

  it('end date is exactly one day after start date', () => {
    const url = generateGoogleCalendarUrl('Test', 'Test', 'Jan 31');
    const params = new URL(url).searchParams;
    const dates = params.get('dates')!;
    const [start, end] = dates.split('/');

    const startYear = parseInt(start.slice(0, 4));
    const startMonth = parseInt(start.slice(4, 6)) - 1;
    const startDay = parseInt(start.slice(6, 8));

    const endYear = parseInt(end.slice(0, 4));
    const endMonth = parseInt(end.slice(4, 6)) - 1;
    const endDay = parseInt(end.slice(6, 8));

    const startDate = new Date(startYear, startMonth, startDay);
    const endDate = new Date(endYear, endMonth, endDay);
    const diffMs = endDate.getTime() - startDate.getTime();
    expect(diffMs).toBe(24 * 60 * 60 * 1000); // exactly 1 day
  });

  it('falls back gracefully for unparseable date strings', () => {
    // Should not throw — returns a valid URL with today's date as fallback
    const url = generateGoogleCalendarUrl('Test', 'Test', 'not-a-date');
    expect(url).toMatch(/^https:\/\/calendar\.google\.com\/calendar\/render/);
    expect(url).toContain('action=TEMPLATE');
  });

  it('is deterministic for the same date string (in same year context)', () => {
    const url1 = generateGoogleCalendarUrl('Event', 'Details', 'Mar 15');
    const url2 = generateGoogleCalendarUrl('Event', 'Details', 'Mar 15');
    expect(url1).toBe(url2);
  });
});
