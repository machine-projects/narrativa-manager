const getStartOfDayISOString = (date) => {
    if (!date || isNaN(new Date(date))) {
      throw new Error("Data inválida fornecida para getStartOfDayISOString");
    }
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // Define a primeira hora do dia
    return startOfDay.toISOString(); // Retorna no formato ISOString
  };
  
  const getEndOfDayISOString = (date) => {
    if (!date || isNaN(new Date(date))) {
      throw new Error("Data inválida fornecida para getEndOfDayISOString");
    }
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // Define a última hora do dia
    return endOfDay.toISOString(); // Retorna no formato ISOString
  };
  
  module.exports = {
    getStartOfDayISOString,
    getEndOfDayISOString,
  };
  