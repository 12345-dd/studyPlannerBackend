const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isValidDate(date) ? date.toISOString() : null;
  };
  
module.exports = { isValidDate, formatDate };