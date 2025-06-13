import React from 'react';

function Pagination({ currentPage, pageCount, onPageChange }) {
  // Hàm chuyển đến trang được chọn
  const paginate = (pageNumber) => {
    onPageChange(pageNumber);
  };

  // Tính toán các trang hiển thị (giới hạn số lượng nút trang hiển thị)
  const getPageNumbers = () => {
    const maxPagesToShow = 5; // Số lượng nút trang tối đa hiển thị

    if (pageCount <= maxPagesToShow) {
      // Nếu tổng số trang ít hơn số lượng tối đa, hiển thị tất cả
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    // Tính toán phạm vi trang để hiển thị
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow ));
    let endPage = startPage + maxPagesToShow - 1;

    // Điều chỉnh nếu endPage vượt quá tổng số trang
    if (endPage > pageCount) {
      endPage = pageCount;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // Không hiển thị phân trang nếu chỉ có 1 trang hoặc không có dữ liệu
  if (pageCount <= 1) return null;

  return (
    <div className="flex justify-center items-center py-4 ">
      <div className="flex justify-between items-center space-x-2">
        <button
          onClick={() => paginate(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          aria-label="Trang trước"
        >
          &laquo;
        </button>

        {getPageNumbers().map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            aria-label={`Trang ${number}`}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => paginate(Math.min(currentPage + 1, pageCount))}
          disabled={currentPage === pageCount}
          className={`px-3 py-1 rounded ${currentPage === pageCount ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          aria-label="Trang tiếp"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}

export default Pagination;