
/**
 * Calculates age based on birth date
 * @param {string|Date} birthDate 
 * @returns {number|null} Age or null if invalid date
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  
  if (isNaN(birth.getTime())) return null;
  
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

/**
 * Formats date to DD/MM/YY
 * @param {string|Date} dateString 
 * @returns {string} Formatted date or 'Unknown'
 */
export const formatBirthDate = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  return new Intl.DateTimeFormat('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: '2-digit' 
  }).format(date);
};
