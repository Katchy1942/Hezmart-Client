import { useState } from 'react';

const usePagination = (initialState = { currentPage: 1, perPage: 20 }) => {
  const [pagination, setPagination] = useState({
    currentPage: initialState.currentPage,
    totalPages: 1,
    totalItems: 0,
    perPage: initialState.perPage
  });

  const updatePagination = (newData) => {
    setPagination(prev => ({
      ...prev,
      ...newData
    }));
  };

  return {
    pagination,
    updatePagination
  };
};

export default usePagination;