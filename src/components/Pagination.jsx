import React from 'react';

function Pagination({ itemsPerPage, totalItems, currentPage, setCurrentPage }) {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 현재 페이지의 앞뒤 2개 페이지 번호만 표시합니다.
  const maxPageNumbers = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);
  
  if (endPage - startPage + 1 < maxPageNumbers && startPage > 1) {
    startPage = Math.max(1, endPage - maxPageNumbers + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <nav className="pagination">
      <ul className="flex list-style-none">
        {/* 이전 페이지 버튼 */}
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
        </li>
        
        {/* 페이지 번호 목록 */}
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => handlePageChange(number)}
              className={currentPage === number ? 'active' : ''}
            >
              {number}
            </button>
          </li>
        ))}
        
        {/* 다음 페이지 버튼 */}
        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
