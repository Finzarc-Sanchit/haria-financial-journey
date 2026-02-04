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