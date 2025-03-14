export const calculatePaginationData = (count, page, perPage) => {
  const totalPage = Math.ceil(count / perPage);
  return {
    page,
    perPage,
    totalItems: count,
    totalPage,
    hasNextPage: page < totalPage,
    hasPreviousPage: page > 1,
  };
};
