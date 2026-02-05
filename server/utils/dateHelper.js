/**
 * Format date to IST timezone in human-readable format
 * @param {string|Date} date - Date string or Date object
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeTime - Whether to include time (default: true)
 * @param {boolean} options.includeSeconds - Whether to include seconds (default: false)
 * @param {boolean} options.dateOnly - Whether to show only date (default: false)
 * @returns {string} Formatted date string in IST (e.g., "15 Jan 2024, 3:45 PM IST")
 */
const formatDateIST = (date, options = {}) => {
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

module.exports = {
    formatDateIST
};

