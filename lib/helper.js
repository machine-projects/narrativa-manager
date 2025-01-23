const getStartOfDayISOString = (date) => {
    const startOfDay = new Date(date); // Cria um objeto Date
    startOfDay.setHours(0, 0, 0, 0);   // Define a primeira hora do dia
    return startOfDay.toISOString();  // Retorna no formato ISOString
  };
  
  // Função para obter a última hora do dia no formato ISOString
  const getEndOfDayISOString = (date) => {
    const endOfDay = new Date(date);  // Cria um objeto Date
    endOfDay.setHours(23, 59, 59, 999); // Define a última hora do dia
    return endOfDay.toISOString();    // Retorna no formato ISOString
  };
  


  module.exports = {
    getStartOfDayISOString,
    getEndOfDayISOString
  };
  