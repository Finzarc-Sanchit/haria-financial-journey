// Utility Functions
export * from './calculatorFunctions';
export * from './validators';

/**
 * Format occupation status for display
 * Converts lowercase values with hyphens to capitalized format
 * @param status - The occupation status value (e.g., "salaried", "self-employed")
 * @returns Formatted string (e.g., "Salaried", "Self-Employed")
 */
export const formatOccupationStatus = (status: string | undefined | null): string => {
  if (!status) return '-';
  
  const statusMap: Record<string, string> = {
    'salaried': 'Salaried',
    'self-employed': 'Self-Employed',
    'business': 'Business Owner',
    'retired': 'Retired',
    'other': 'Other'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Format date to IST timezone in human-readable format
 * @param date - Date string or Date object
 * @param options - Formatting options
 * @returns Formatted date string in IST (e.g., "15 Jan 2024, 3:45 PM IST")
 */
export const formatDateIST = (
  date: string | Date | undefined | null,
  options: {
    includeTime?: boolean;
    includeSeconds?: boolean;
    dateOnly?: boolean;
  } = {}
): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '-';
    
    const { includeTime = true, includeSeconds = false, dateOnly = false } = options;
    
    // Use Intl.DateTimeFormat to get IST components
    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: includeTime ? 'numeric' : undefined,
      minute: includeTime ? '2-digit' : undefined,
      second: (includeTime && includeSeconds) ? '2-digit' : undefined,
      hour12: includeTime
    });
    
    const parts = formatter.formatToParts(dateObj);
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';
    
    if (dateOnly || !includeTime) {
      return `${day} ${month} ${year}`;
    }
    
    const hour = parts.find(p => p.type === 'hour')?.value || '12';
    const minute = parts.find(p => p.type === 'minute')?.value || '00';
    const second = parts.find(p => p.type === 'second')?.value || '00';
    const dayPeriod = parts.find(p => p.type === 'dayPeriod')?.value?.toUpperCase() || 'AM';
    
    if (includeSeconds) {
      return `${day} ${month} ${year}, ${hour}:${minute}:${second} ${dayPeriod} IST`;
    }
    
    return `${day} ${month} ${year}, ${hour}:${minute} ${dayPeriod} IST`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
}; 