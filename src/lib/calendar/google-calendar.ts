/**
 * Generates a pre-filled Google Calendar event URL.
 * This avoids OAuth complexity while providing the necessary user utility.
 */
export function generateGoogleCalendarUrl(title: string, details: string, dateStr: string): string {
  // Convert basic date strings (e.g. "Nov 5") to a valid year format if needed,
  // or simply use a full-day format.
  // For a simple demo without strict year parsing, we'll assume the current year.
  const currentYear = new Date().getFullYear();
  let startDate = new Date(`${dateStr}, ${currentYear}`);
  
  if (isNaN(startDate.getTime())) {
    // Fallback if parsing fails
    startDate = new Date();
  }

  // Format as YYYYMMDD
  const formattedDate = startDate.toISOString().split('T')[0].replace(/-/g, '');
  // Since it's an all-day event, we use formattedDate/formattedDate+1
  const endDateObj = new Date(startDate);
  endDateObj.setDate(endDateObj.getDate() + 1);
  const formattedEndDate = endDateObj.toISOString().split('T')[0].replace(/-/g, '');

  const dates = `${formattedDate}/${formattedEndDate}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: details,
    dates: dates,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
