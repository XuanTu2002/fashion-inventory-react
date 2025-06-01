/**
 * Format a number as Vietnamese currency with thousand separators
 * @param {number} value - The number to format
 * @returns {string} Formatted currency string with ₫ symbol
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return "0 ₫";
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Format the number with thousand separators
  return numValue.toLocaleString('vi-VN') + " ₫";
};
