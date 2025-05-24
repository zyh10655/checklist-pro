// ========================================
// FRONTEND - src/components/UI/Pagination.js
// ========================================

import React from 'react';
import { motion } from 'framer-motion';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5 
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="pagination" aria-label="Pagination Navigation">
      <div className="pagination-container">
        {/* First Page */}
        {showFirstLast && currentPage > 1 && (
          <button
            onClick={() => onPageChange(1)}
            className="pagination-btn first"
            aria-label="Go to first page"
          >
            ««
          </button>
        )}

        {/* Previous Page */}
        {showPrevNext && currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="pagination-btn prev"
            aria-label="Go to previous page"
          >
            ‹
          </button>
        )}

        {/* Page Numbers */}
        <div className="pagination-pages">
          {visiblePages[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="pagination-btn"
              >
                1
              </button>
              {visiblePages[0] > 2 && (
                <span className="pagination-ellipsis">...</span>
              )}
            </>
          )}

          {visiblePages.map(page => (
            <motion.button
              key={page}
              onClick={() => onPageChange(page)}
              className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </motion.button>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span className="pagination-ellipsis">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="pagination-btn"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Page */}
        {showPrevNext && currentPage < totalPages && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="pagination-btn next"
            aria-label="Go to next page"
          >
            ›
          </button>
        )}

        {/* Last Page */}
        {showFirstLast && currentPage < totalPages && (
          <button
            onClick={() => onPageChange(totalPages)}
            className="pagination-btn last"
            aria-label="Go to last page"
          >
            »»
          </button>
        )}
      </div>

      {/* Page Info */}
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  );
};

export default Pagination;