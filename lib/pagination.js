/**
 * Aplica paginação a uma lista de itens.
 * @param {Array} items - Lista de itens a serem paginados.
 * @param {number} page - Número da página.
 * @param {number} limit - Número máximo de itens por página.
 * @returns {Object} - Resultados paginados.
 */
const paginate = (items, page, limit) => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    currentPage,
    totalPages,
    totalItems,
    data: items.slice(startIndex, endIndex),
  };
};

module.exports = paginate;
